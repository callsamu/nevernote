import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IDB_INSTANCE, NevernoteIDB } from './provider';
import { NoteCreateInput, NoteListOptions, NoteRepository } from '../note-repository';
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

  list(_: NoteListOptions): Observable<PagedResults<Note>> {
    return this.fromIdb(async (idb) => {
      const store = await this.store(idb, 'readonly');
      const records = await store.getAll();

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
      }

      store.add && store.add(note);

      return note;
    })

  /*
  update(id: string, input: NoteUpdateInput): Observable<Note> {

  }

  delete(id: string): Observable<void> {

  }

  move(noteId: string, targetNotebookId: string) {

  }

  addTags(noteId: string, tagIds: string[]) {

  }

  removeTags(noteId: string, tagIds: string[]) {

  }
  */
}}
