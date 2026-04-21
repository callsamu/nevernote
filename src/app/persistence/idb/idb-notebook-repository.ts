import { inject, Injectable } from '@angular/core';
import { IDB_INSTANCE, STORES, NevernoteIDB } from './provider';
import { from, Observable } from 'rxjs';
import { Notebook } from '@app/notebook';
import { generateId, PagedResults } from '../common';
import { NotebookCreateInput, NotebookListOptions } from '../notebook-repository';
import { NoteUpdateInput } from '../note-repository';

@Injectable()
export class IDBNotebookRepository {
  private idb$ = inject(IDB_INSTANCE);

  private fromIdb<T>(fn: (db: NevernoteIDB) => Promise<T>): Observable<T> {
    return from(this.idb$.then(fn));
  }

  private async store(idb: NevernoteIDB, mode: IDBTransactionMode) {
    const tr = idb.transaction(STORES.NOTEBOOKS, mode);
    return tr.store;
  }

  getById(id: string): Observable<Notebook| null> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      const record = await store.get(id);
      return record ?? null;
    })
  }

  list(opts: NotebookListOptions): Observable<PagedResults<Notebook>> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      let records = await store.getAll();

      const trashed = opts?.trashed ?? false;
      records = records.filter(n => n.trashed === trashed);

      switch (opts.sort) {
        case 'createdAt':
          records.sort((a, b) =>  {
            const da = a[opts.sort] as Date;
            const db = b[opts.sort] as Date;
            return da.getTime() < db.getTime() ? 1 : -1;
          })
          break;
        case 'name':
          records.sort((a, b) => {
            const sa = a[opts.sort] as string;
            const sb = b[opts.sort] as string;
            return sa < sb ? 1 : -1;
          })
          break;
        default:

      }

      return {
        items: records,
      };
    })
  }

  create(input: NotebookCreateInput): Observable<Notebook> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const now = new Date();

      const notebook: Notebook = {
        id: generateId(),
        version: 1,
        name: input.name,
        description: input.description,
        createdAt: now,
        updatedAt: now,
        trashed: false
      };

      if (!store.add) {
        console.error("store.add method is undefined");
      } else {
        store.add(notebook);
      }

      return notebook;
    })
  }

  update(id: string, input: NoteUpdateInput): Observable<Notebook> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readwrite');
      const existing = await store.get(id);
      const now = new Date();

      if (!existing) {
        throw new Error(`Notebook not found: ${id}`);
      }

      const updated: Notebook = {
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

  remove(id: string, cascade: boolean): Observable<void> {
    return this.fromIdb(async (idb) => {
      const tx = idb.transaction([STORES.NOTES, STORES.NOTEBOOKS], 'readwrite');

      const noteStore = tx.objectStore(STORES.NOTES);
      const notebookStore = tx.objectStore(STORES.NOTEBOOKS);


      let deletionPromises: Promise<void>[] = [];

      if (cascade) {
        const noteRecords = await noteStore.index('byNotebook').getAll();

        if (noteStore.delete === undefined || notebookStore.delete === undefined) {
          throw new Error('notebook remove: delete methods are undefined')
        }

        deletionPromises = noteRecords.map(({ id })=> noteStore.delete(id))
      }

      deletionPromises.push(notebookStore.delete(id));

      // Aguarde até que todas as promessas sejam resolvidas
      await Promise.all(deletionPromises);
    })
  }
}
