import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { Note } from './note';
import { NoteService } from './note-service';
import { SafeHTMLPipe } from './safe-html-pipe';
import { NoteView } from './editor/note-view/note-view'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, SafeHTMLPipe, NoteView],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  counter = 2;
  noteService: NoteService = inject(NoteService);

  notes: WritableSignal<Note[]> = signal(this.noteService.getAll())

  editorOpen = signal(false);
  selectedNote = signal<Note | null>(null);

  select(note: Note) {
    this.editorOpen.set(true);
    this.selectedNote.set(note);
  }

  create() {
    this.editorOpen.set(true)
    this.selectedNote.set(null);
  }
}
