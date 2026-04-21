import { InjectionToken } from '@angular/core';
import { Note } from '@app/note';
import { Notebook } from '@app/notebook';
import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from 'idb';

const DB_NAME = 'nevernote_db'

export enum STORES {
  NOTES = 'notes',
  NOTEBOOKS = 'notebooks'
}

interface NevernoteSchema extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      byNotebook: 'notebookId'
    }
  }
  notebooks: {
    key: string;
    value: Notebook;
  }
}

export type NevernoteIDB = IDBPDatabase<NevernoteSchema>;

export const IDB_INSTANCE = new InjectionToken<Promise<IDBPDatabase<NevernoteSchema>>>('idb.instance', {
  providedIn: 'root',
  factory() {
    console.info("Creating IDB Instance...");

    return openDB<NevernoteSchema>(DB_NAME, 10, {
      upgrade(db, _, __, tr) {
        console.info('Running IDB update')

        const noteStore = !db.objectStoreNames.contains('notes') ?
          db.createObjectStore('notes', { keyPath: 'id' }) :
          tr.objectStore('notes');

        if (!noteStore.indexNames.contains('byNotebook')) {
          noteStore.createIndex('byNotebook', 'notebookId');
        }

        if (!db.objectStoreNames.contains('notebooks')) {
          db.createObjectStore('notebooks', { keyPath: 'id' });
          }
      }
    });
  },
});

