import { inject, Injectable } from "@angular/core";
import { IDB_INSTANCE, NevernoteIDB, STORES } from "./db";
import { from, Observable, switchMap } from "rxjs";
import MiniSearch from 'minisearch';
import { NoteSearchOptions, SearchRepository } from "../search-repository";
import { Note } from "@app/note";
import { PagedResults } from "../common";

@Injectable()
export class IDBSearchRepository extends SearchRepository {
  private idb$ = inject(IDB_INSTANCE);
  private minisearch: MiniSearch;
  private ready: Promise<void>;

  constructor() {
    super();
    this.minisearch = this.createEngine();
    this.ready = this.buildIndex(this.minisearch);
  }

  private fromIdb<T>(fn: (idb: NevernoteIDB) => Promise<T>): Observable<T> {
    return from(this.idb$.then(fn));
  }

  private createEngine(): MiniSearch {
    return new MiniSearch({
      fields: ['title', 'content'],
      storeFields: ['id'],
    });
  }

  private buildIndex(ms: MiniSearch): Promise<void> {
    return this.idb$.then(async (idb) => {
      const { store } = idb.transaction(STORES.NOTES, 'readonly');
      const records = await store.getAll();
      ms.addAll(records.map(n => this.convert(n)));
    });
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent ?? '';
  }

  private convert(note: Note) {
    return {
      id: note.id,
      title: note.title,
      content: this.stripHtml(note.content),
    };
  }

  searchNotes(options: NoteSearchOptions): Observable<PagedResults<Note>> {
    return from(this.ready).pipe(
      switchMap(() => this.fromIdb(async (idb) => {
        const results = this.minisearch.search(options.keyword, {
          prefix: true,
          fuzzy: 0.2
        });
        const ids = new Set(results.map(r => r.id));

        const { store } = idb.transaction(STORES.NOTES, 'readonly');
        const notes = await store.getAll();
        const matched = notes.filter(n => ids.has(n.id));

        return {
          items: matched
        };
      }))
    );
  }

  index(note: Note) {
    if (this.minisearch.has(note.id)) {
      this.minisearch.replace(this.convert(note));
    } else {
      this.minisearch.add(this.convert(note));
    }
  }

  deindex(note: Note) {
    if (this.minisearch.has(note.id)) {
      this.minisearch.remove(this.convert(note));
    }
  }
}
