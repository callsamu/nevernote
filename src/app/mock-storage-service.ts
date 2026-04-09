import { Note } from './note';
import { Injectable } from '@angular/core';

const stubNotes: Note[] = [
  {
    id: 1,
    version: 1,
    title: "Meeting Notes",
    content: "Discussed the upcoming project timeline and deliverables.",
    createDate: new Date('2023-10-01T10:00:00Z'),
    modifyDate: new Date('2023-10-02T12:00:00Z'),
    notebook: "Work",
    tags: ["project", "timeline", "meeting"],
    pinned: true,
    isTrashed: false,
  },
  {
    id: 2,
    version: 2,
    title: "Shopping List",
    content: "Need to buy groceries for the week.",
    createDate: new Date('2023-10-03T14:00:00Z'),
    modifyDate: new Date('2023-10-03T14:30:00Z'),
    tags: ["groceries", "shopping"],
    pinned: false,
    isTrashed: false,
  },
  {
    id: 3,
    version: 1,
    title: "Ideas for New Blog Post",
    content: "Write about the importance of mindfulness in daily life.",
    createDate: new Date('2023-09-25T16:00:00Z'),
    modifyDate: new Date('2023-09-26T18:00:00Z'),
    notebook: "Personal",
    tags: ["mindfulness", "blog", "self-improvement"],
    pinned: false,
    isTrashed: false,
  },
  {
    id: 4,
    version: 1,
    title: "Old Receipts",
    content: "Scan and store receipts from last month's purchases.",
    createDate: new Date('2023-08-15T12:00:00Z'),
    modifyDate: new Date('2023-08-20T09:30:00Z'),
    notebook: "Personal",
    tags: ["receipts", "finances"],
    pinned: false,
    isTrashed: true,
  },
  {
    id: 5,
    version: 1,
    title: "Yoga Routine",
    content: "Morning yoga session with stretches and meditation.",
    createDate: new Date('2023-10-05T06:00:00Z'),
    modifyDate: new Date('2023-10-05T06:15:00Z'),
    notebook: "Health",
    tags: ["yoga", "morning routine"],
    pinned: true,
    isTrashed: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockStorageService {
  private notes = new Map<number, Note>(stubNotes.map(note => [note.id, note]));

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
