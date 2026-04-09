import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MarkdownEditor } from './editor/markdown-editor/markdown-editor';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from './editor/editor-service';
import { Note } from './note';
import { NoteService } from './note-service';
import { SafeHTMLPipe } from './safe-html-pipe';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarkdownEditor, ReactiveFormsModule,SafeHTMLPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  counter = 2;

  editorService: EditorService = inject(EditorService);
  noteService: NoteService = inject(NoteService);

  noteTitleControl = new FormControl('título');
  notes: WritableSignal<Note[]> = signal(this.noteService.getAll())

  onCreate() {
    const note = this.noteService.create(
      this.noteTitleControl.getRawValue() ?? '',
      this.editorService.getHTMLContent() ?? '',
    );

    this.notes.set([...this.notes(), note]);
  }
}
