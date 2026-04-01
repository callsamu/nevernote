import { Note } from './note';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockStorageService {
  private notes = new Map<number, Note>();

  all(): Note[] {
    return Array.from(this.notes.values());
  }

  get(id: number): Note | undefined {
    return this.notes.get(id);
  }

  set(id: number, note: Note) {
    this.notes.set(id, note);
  }

  update(id: number, newNote: Note) {
    this.notes.set(id, newNote);
  }

  delete(id: number): boolean {
    return this.notes.delete(id);
  }

  clear(): void {
    this.notes.clear();
  }
}
