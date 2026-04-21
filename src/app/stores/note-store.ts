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

  private list(opts?: NoteListOptions) {
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
    }).subscribe(note => {
      const notes = this.contents();
      this.contents.set([ note, ...notes ]);
    })
  }


  update(input: NoteUpdateInput) {
    this.repository.create({
      ...input,
    }).subscribe(updated => {
      const notes = this.contents();

      const removed = notes.filter(note => note.id === updated.id);
      this.contents.set([ updated, ...removed ])

      if (this.selected()?.id === updated.id) {
        this.selected.set(updated);
      }
    })
  }

  remove(id: string) {
    this.repository.remove(id).subscribe(() => {
      const contents = this.contents();
      const removed = contents.filter(note => note.id === id);
      this.contents.set(removed);

      if (this.selected()?.id === id) {
        this.selected.set(null);
      }
    })
  }
}
