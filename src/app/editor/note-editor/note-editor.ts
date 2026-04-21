import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { Note } from '../../note';
import { EditorFactory } from '../editor';
import { TiptapFactory } from '../tiptap-factory';
import { Editor } from '../editor';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  heroBookOpen,
  heroClock,
  heroClipboardDocumentCheck,
  heroPaperClip,
  heroArchiveBoxArrowDown,
  heroPencilSquare,
  heroPlus,
  heroDocumentText,
} from '@ng-icons/heroicons/outline';


export type NoteSavedEvent = Pick<Note, 'title' | 'content'>;


@Component({
  selector: 'nevernote-note-editor',
  providers: [provideIcons({
    heroBookOpen, heroClock,
    heroClipboardDocumentCheck, heroPaperClip,
    heroArchiveBoxArrowDown, heroPencilSquare, heroPlus, heroDocumentText,
  })],
  imports: [DatePipe, FormsModule,NgIcon],
  templateUrl: './note-editor.html',
})
export class NoteEditor {
  factory: EditorFactory = inject(TiptapFactory);

  note = input.required<Note | null>();
  noteSaved = output<NoteSavedEvent>();

  title = signal('Untitled');
  editable = signal(false);
  protected readonly container = viewChild.required('editorContainer');

  wordCount = computed(() => 0);

  editor!: Editor;

  constructor() {
    effect(() => {
      const note = this.note();
      console.log("changing note");

      if (!note) {
        this.editable.set(true);
      } else {
        this.editable.set(false);
        this.title.set(note.title);
      }

      const editor = this.factory.make({
        contentHTML: note ? note.content : '',
        editable: note ? false : true,
      });

      if (this.editor) {
        this.editor.destroy();
      }

      editor.mount(this.container() as ElementRef<HTMLElement>);
      this.editor = editor;
    })

    effect(() => {
      const editable = this.editable();
      this.editor.setEditable(editable);
    })
  }

  onEdit() {
    this.editable.set(true);
  }

  onSave() {
    this.noteSaved.emit({
      title: this.title(),
      content: this.editor.getHTML(),
    });
    this.editable.set(false);
  }
}

