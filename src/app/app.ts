import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { Note } from './note';
import { SafeHTMLPipe } from './safe-html-pipe';
import { NoteDraft, NoteView } from './editor/note-view/note-view'
import { DatePipe } from '@angular/common';
import { IDBNoteRepository } from './persistence/idb/idb-note-repository';
import { NoteRepository } from './persistence/note-repository';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, SafeHTMLPipe, NoteView, DatePipe],
  providers: [{ provide: NoteRepository, useClass: IDBNoteRepository }],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  repository = inject(NoteRepository);

  notes: WritableSignal<Note[]> = signal([])

  ngOnInit() {
    const $result = this.repository.list({ sort: "title" });
    $result.subscribe(({ items }) => {
      this.notes.set(items);
    });
  }

  editorOpen = signal(false);
  selectedNote = signal<Note | null>(null);

  select(note: Note) {
    this.editorOpen.set(true);
    this.selectedNote.set(note);
  }

  onCapture() {
    this.editorOpen.set(true)
    this.selectedNote.set(null);
  }

  onNoteSaved(draft: NoteDraft) {
    const note$ = this.repository.create({
      title: draft.title,
      content: draft.content,
      notebookId: '',
    });

    note$.subscribe(note => {
      this.selectedNote.set(note);
      this.notes.set([...this.notes(), note]);
    })
  }
}
