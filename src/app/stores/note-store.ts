import { effect, inject, Injectable, signal } from '@angular/core';
import { Note } from '@app/note';


function sortNotes(notes: Note[]) {
  return [...notes].sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;

    const ad = a.updatedAt.getTime();
    const bd = b.updatedAt.getTime();

    return bd * bp - ad * ap;
  });
}

@Injectable({
  providedIn: 'root',
})
export class NoteStore {
  readonly contents = signal<Note[]>([]);
  readonly selected = signal<Note | null>(null);

  constructor() {
    effect(() => {
      console.debug(this.contents());
    })
  }

  set(newContents: Note[]) {
    this.contents.set(newContents);
  }

  add(note: Note) {
    const previous = this.contents();
    const curr = [...previous, note];
    const sorted = sortNotes(curr);

    this.contents.set(sorted);
  }

  update(updatedNote: Note) {
    console.log(this);
    const previous = this.contents();
    const curr = previous.map(
      note => note.id === updatedNote.id ? updatedNote : note
    );
    const sorted = sortNotes(curr);

    this.contents.set(sorted);
  }

  remove(id: string) {
    const previous = this.contents();
    const filtered = previous.filter(note => note.id !== id);

    this.contents.set(filtered);
  }
}
