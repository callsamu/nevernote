import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IDB_INSTANCE, NevernoteIDB } from './provider';
import { NoteCreateInput, NoteListOptions, NoteRepository, NoteUpdateInput } from '../note-repository';
import { Note } from '@app/note';
import { generateId, PagedResults } from '../common';

enum STORE {
  NOTES = 'notes',
};

@Injectable()
export class IDBNoteRepository extends NoteRepository {
  private idb$ = inject(IDB_INSTANCE);

  private fromIdb<T>(fn: (db: NevernoteIDB) => Promise<T>): Observable<T> {
    return from(this.idb$.then(fn));
  }

  private async store(idb: NevernoteIDB, mode: IDBTransactionMode) {
    const tr = idb.transaction(STORE.NOTES, mode);
    return tr.store;
  }

  getById(id: string): Observable<Note | null> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      const record = await store.get(id);
      return record ?? null;
    })
  }

  list(opts: NoteListOptions): Observable<PagedResults<Note>> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      let records = await store.getAll();

      const trashed = opts?.trashed ?? false;
      records = records.filter(n => n.trashed === trashed);

      if (opts?.notebookId) {
        records = records.filter(n => n.notebookId === opts.notebookId);
      }

      if (opts?.tagIds?.length) {
        records = records.filter(n =>
          opts.tagIds!.every(t => n.tagIds.includes(t))
        );
      }

      switch (opts.sort) {
        case 'updatedAt':
        case 'createdAt':
          records.sort((a, b) =>  {
            const da = a[opts.sort] as Date;
            const db = b[opts.sort] as Date;
            return da.getTime() < db.getTime() ? 1 : -1;
          })
          break;
        case 'title':
          records.sort((a, b) => {
            const sa = a[opts.sort] as string;
            const sb = b[opts.sort] as string;
            return sa < sb ? 1 : -1;
          })
          break;
      }

      return {
        items: records,
      };
    })
  }

  create({ title, content, notebookId }: NoteCreateInput): Observable<Note> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const now = new Date();

      const note: Note = {
        id: generateId(),
        version: 1,
        title: title,
        content: content,
        notebookId: notebookId,
        tagIds: [],
        createdAt: now,
        updatedAt: now,
        pinned: false,
        trashed: false
      };

      if (!store.add) {
        console.error("store.add method is undefined");
      } else {
        store.add(note);
      }

      return note;
    })
  }

  update(id: string, input: Partial<NoteUpdateInput>): Observable<Note> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const existing = await store.get(id);
      const now = new Date();

      if (!existing) {
        throw new Error(`Note not found: ${id}`);
      }

      const updated: Note = {
        ...existing,
        ...input,
        id,
        version: existing.version + 1,
        updatedAt: now,
      };

      if (!store.put) {
        console.error("store.put method is undefined");
      } else {
        await store.put(updated);
      }

      return updated;
    });
  }

  remove(id: string): Observable<void> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');

      if (!store.delete) {
        console.error("store.delete method is undefined");
      } else {
        store.delete(id);
      }
    })
  }

  /*
  move(noteId: string, targetNotebookId: string) {

  }

  addTags(noteId: string, tagIds: string[]) {

  }

  removeTags(noteId: string, tagIds: string[]) {

  }
  */
}
