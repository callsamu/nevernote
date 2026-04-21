import { InjectionToken } from '@angular/core';
import { Note } from '@app/note';
import { Notebook } from '@app/notebook';
import { Tag } from '@app/tag';
import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from 'idb';

const DB_NAME = 'nevernote_db'
const DB_VERSION = 12;

export enum STORES {
  NOTES = 'notes',
  NOTEBOOKS = 'notebooks',
  TAGS = 'tags'
}

interface NevernoteSchema extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      byNotebook: string
      byTag: string
    }
  }
  notebooks: {
    key: string;
    value: Notebook;
  }
  tags: {
    key: string;
    value: Tag;
  }
}

export type NevernoteIDB = IDBPDatabase<NevernoteSchema>;

export const IDB_INSTANCE = new InjectionToken<Promise<IDBPDatabase<NevernoteSchema>>>('idb.instance', {
  providedIn: 'root',
  factory() {
      console.info("Creating IDB Instance...");

    return openDB<NevernoteSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, _, __, tr) {
        console.info('Running IDB update')

        // Notes
        const noteStore = !db.objectStoreNames.contains('notes') ?
          db.createObjectStore('notes', { keyPath: 'id' }) :
          tr.objectStore('notes');

        if (!noteStore.indexNames.contains('byNotebook')) {
          noteStore.createIndex('byNotebook', 'notebookId');
        }

        if (!noteStore.indexNames.contains('byTag')) {
          noteStore.createIndex('byTag', 'tagIds', { multiEntry: true });
        }

        // Notebooks
        if (!db.objectStoreNames.contains('notebooks')) {
          db.createObjectStore('notebooks', { keyPath: 'id' });
        }

        // Tags
        if (!db.objectStoreNames.contains('tags')) {
          db.createObjectStore('tags', { keyPath: 'id' });
        }
      }
    });
  },
});

