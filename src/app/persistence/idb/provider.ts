import { InjectionToken } from '@angular/core';
import { Note } from '@app/note';
import { Notebook } from '@app/notebook';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'nevernote_db'

export enum STORES {
  NOTES = 'notes',
  NOTEBOOKS = 'notebooks'
}

interface NevernoteSchema extends DBSchema {
  [STORES.NOTES]: {
    key: string;
    value: Note;
  }
  [STORES.NOTEBOOKS]: {
    key: string;
    value: Notebook;
  }
}

export type NevernoteIDB = IDBPDatabase<NevernoteSchema>;

function createStoreIfNotExists(db: NevernoteIDB, store: STORES) {
  if (!db.objectStoreNames.contains(STORES.NOTES)) {
    db.createObjectStore(store, { keyPath: 'id' })
  }
}


export const IDB_INSTANCE = new InjectionToken<Promise<IDBPDatabase<NevernoteSchema>>>('idb.instance', {
  providedIn: 'root',
  factory() {
    return openDB<NevernoteSchema>(DB_NAME, 1, {
      upgrade(db) {
        createStoreIfNotExists(db, STORES.NOTES);
        createStoreIfNotExists(db, STORES.NOTEBOOKS);
      }
    });
  },
});

