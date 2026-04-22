import { inject, Injectable, signal } from '@angular/core';
import { Note } from '@app/note';
import { NoteListOptions, NoteRepository, NoteUpdateInput } from '@app/persistence/note-repository';

@Injectable({
  providedIn: 'root',
})
export class NoteStore {
  repository = inject(NoteRepository);

  selected = signal<Note | null>(null);
  contents = signal<Note[]>([]);

  constructor() {
    this.listAll();
  }

  list(opts?: NoteListOptions) {
    const _opts = opts ?? { sort: 'updatedAt' };
    console.info(opts);

    this.repository.list(_opts).subscribe(records => {
      this.contents.set(records.items);
    });

  }

  listAll() {
    this.list();
  }

  listByNotebookId(id: string) {
    this.list({
      sort: 'updatedAt',
      notebookId: id,
    });
  }

  listByTagId(id: string) {
    this.list({
      sort: 'updatedAt',
      tagIds: [id],
    })
  }

  create(title: string, content: string, notebookId?: string) {
    this.repository.create({
      title,
      content,
      notebookId: notebookId ?? '',
      tagIds: [],
    }).subscribe(note => {
      const notes = this.contents();
      this.contents.set([ note, ...notes ]);
    })
  }

  update(id: string, input: NoteUpdateInput) {
    this.repository.update(id, {
      ...input,
    }).subscribe(updated => {
      const notes = this.contents();

      if (input.pinned === true) {
        const filtered = notes.filter(note => note.id !== updated.id);
        this.contents.set([updated, ...filtered]);
      } else if (input.pinned === false) {
        const pinned: Note[] = [];
        const unpinned: Note[] = [];

        for (const note of notes) {
          if (note.id !== updated.id) {
            note.pinned ? pinned.push(note) : unpinned.push(note);
          }
        }

        this.contents.set([...pinned, updated, ...unpinned])
      } else {
        const idx = notes.findIndex(note => note.id === updated.id);
        notes[idx] = updated;
        this.contents.set([...notes])
      }
    })
  }

  removeFromStore(id: string) {
    const contents = this.contents();
    const removed = contents.filter(note => note.id !== id);
    console.debug(id, contents, removed);
    this.contents.set(removed);

    if (this.selected()?.id === id) {
      this.selected.set(null);
    }
  }

  remove(id: string) {
    this.repository.remove(id).subscribe(() => this.removeFromStore(id));
  }
}
