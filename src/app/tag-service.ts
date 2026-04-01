import { inject, Injectable } from '@angular/core';
import { MockStorageService } from './mock-storage-service';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags: string[] = [];
  storage = inject(MockStorageService);

  create(tag: string) {
    this.tags.push(tag);
  }

  exists(tag: string) {
    this.tags.includes(tag);
  }

  apply(note: Note, tag: string) {
    this.storage.set(note.id, {
      ...note,
      tags: !note.tags ? [tag] : [...note.tags, tag]
    });
  }

  notesByTag(tag: string) {
    return this.storage.all().filter(note => note.tags?.includes(tag));
  }
}
