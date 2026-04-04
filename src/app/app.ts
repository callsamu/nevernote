import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MarkdownEditor } from './editor/markdown-editor/markdown-editor';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from './editor/editor-service';
import { Note } from './note';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarkdownEditor, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  counter = 2;
  editor: EditorService = inject(EditorService);

  noteTitleControl = new FormControl('título');
  notes: WritableSignal<Pick<Note, 'id' | 'title' | 'content'>[]> = signal([
    {
      id: 0,
      title: 'foo',
      content: '<p>lorem ipsum dolor</p>',
    },
    {
      id: 1,
      title: 'bar',
      content: '<p>lorem <b>ipsum</b> dolor</p>',
    }
  ]);


  onCreate() {
    this.notes.set([
      ...this.notes(),
      {
        id: this.counter++,
        title: this.noteTitleControl.value ?? '',
        content: this.editor.getHTMLContent() ?? '',
      }
    ])
  }
}
