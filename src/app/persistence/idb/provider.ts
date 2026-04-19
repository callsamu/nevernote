import { InjectionToken } from '@angular/core';
import { Note } from '@app/note';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'nevernote_db'

interface NevernoteSchema extends DBSchema {
  notes: {
    key: string;
    value: Note;
  }
}

export type NevernoteIDB = IDBPDatabase<NevernoteSchema>;

export const IDB_INSTANCE = new InjectionToken<Promise<IDBPDatabase<NevernoteSchema>>>('idb.instance', {
  providedIn: 'root',
  factory() {
    return openDB<NevernoteSchema>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
      }
    });
  },
});

