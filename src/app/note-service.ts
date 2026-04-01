import { Injectable, inject } from '@angular/core';
import { MockStorageService } from './mock-storage-service';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private idCounter = 1;
  storage: MockStorageService = inject(MockStorageService);

  getAll(): Note[] {
    return this.storage.all();
  }

  getById(id: number): Note | undefined {
    return this.storage.get(id);
  }

  create(title: string, content: string, notebook?: string): Note {
    const now = new Date();

    const note: Note = {
      id: this.idCounter++,
      version: 1,
      title,
      content,
      createDate: now,
      modifyDate: now,
      notebook,
      pinned: false,
      isTrashed: false,
    };

    this.storage.set(note.id, note);
    return note;
  }

  update(id: number, updates: Partial<Pick<Note, 'title' | 'content' | 'notebook'>>): Note | undefined {
    const note = this.storage.get(id);
    if (!note) return undefined;

    const updated: Note = {
      ...note,
      ...updates,
      version: note.version + 1,
      modifyDate: new Date(),
    };

    this.storage.set(id, updated);
    return updated;
  }

  togglePin(id: number): Note | undefined {
    const note = this.storage.get(id);
    if (!note) return undefined;

    const updated: Note = {
      ...note,
      pinned: !note.pinned,
      version: note.version + 1,
      modifyDate: new Date(),
    };

    this.storage.set(id, updated);
    return updated;
  }
}
