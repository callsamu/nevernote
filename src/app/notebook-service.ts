import { inject, Injectable } from '@angular/core';
import { MockStorageService } from './mock-storage-service';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class NotebookService {
  notebooks: string[] = [];
  storage = inject(MockStorageService);

  create(notebookName: string) {
    this.notebooks.push(notebookName);
  }

  exists(notebookName: string) {
    this.notebooks.includes(notebookName);
  }

  move(note: Note, notebookName: string) {
    this.storage.set(note.id, {
      ...note,
      notebook: notebookName,
    });
  }

  notes(notebookName: string) {
    return this.storage.all().filter(note => note.notebook == notebookName);
  }
}
