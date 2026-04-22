import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IDB_INSTANCE, STORES, NevernoteIDB } from './db';
import { generateId, PagedResults } from '../common';
import { TagCreateInput, TagListOptions, TagRepository, TagUpdateInput } from '../tag-repository';
import { Tag } from "@app/tag";

@Injectable()
export class IDBTagRepository extends TagRepository {

  private idb$ = inject(IDB_INSTANCE);

  private fromIdb<T>(fn: (idb: NevernoteIDB) => Promise<T>): Observable<T> {
    return from(this.idb$.then(fn));
  }

  private async store(idb: NevernoteIDB, mode: IDBTransactionMode) {
    return idb.transaction(STORES.TAGS, mode).store;
  }

  getById(id: string): Observable<Tag | null> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      const record = await store.get(id);
      return record ?? null;
    });
  }

  list(opts: TagListOptions): Observable<PagedResults<Tag>> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      let records: Tag[] = await store.getAll();

      const trashed = opts?.trashed ?? false;
      records = records.filter(t => t.trashed === trashed);

      switch (opts?.sort) {
        case 'name':
          records.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'createdAt':
          records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        default:
          break;
      }

      return { items: records };
    });
  }

  create(input: TagCreateInput): Observable<Tag> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const now = new Date();

      const tag: Tag = {
        id:        generateId(),
        version:   1,
        name:      input.name,
        color:     input.color,
        createdAt: now,
        updatedAt: now,
        trashed:   false,
      };

        if (!store.add) {
        throw new Error("tag repository: put is undefined");
      }

      await store.add(tag);
      return tag;
    });
  }

  update(id: string, input: TagUpdateInput): Observable<Tag> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const existing = await store.get(id);

      if (!existing) throw new Error(`Tag not found: ${id}`);

      const updated: Tag = {
        ...existing,
        ...input,
        id,
        version: existing.version + 1,
        updatedAt: new Date(),
      };

      if (!store.put) {
        throw new Error("tag repository: put is undefined");
      }
      await store.put(updated);
      return updated;
    });
  }

  remove(id: string): Observable<void> {
    return this.fromIdb(async (idb) => {
      const tx = idb.transaction([STORES.NOTES, STORES.TAGS], 'readwrite');
      const noteStore = tx.objectStore(STORES.NOTES);
      const tagStore = tx.objectStore(STORES.TAGS);

      const affectedNotes = await noteStore.index('byTag').getAll(id);

      const updates = affectedNotes.map(note => {
        const patched = {
          ...note,
          tagIds: note.tagIds.filter((t: string) => t !== id),
          version: note.version + 1,
          updatedAt: new Date(),
        };

        return noteStore.put(patched);
      });

      await Promise.all([...updates, tagStore.delete(id)]);
    });
  }
}
