import { inject, Injectable } from '@angular/core';
import { MockStorageService } from './mock-storage-service';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  storage: MockStorageService = inject(MockStorageService);

  results: Note[] = [];

  search(term: string) {
    const all = this.storage.all();

    this.results = all.filter(note =>
      note.title.includes(term) || note.content.includes(term)
    );
  }

  clear() {
    this.results = [];
  }
}
