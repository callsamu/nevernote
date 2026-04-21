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
import { Notebook } from '@app/notebook';


export type NoteSavedEvent = Pick<Note, 'title' | 'content' | 'notebookId'>;


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
  noteRepo = inject
  factory: EditorFactory = inject(TiptapFactory);

  note = input.required<Note | null>();
  notebooks = input.required<Notebook[]>();

  protected readonly container = viewChild.required('editorContainer');

  title = signal('Untitled');
  notebookId = signal('');
  editable = signal(false);

  wordCount = computed(() => 0);

  noteSaved = output<NoteSavedEvent>();

  editor!: Editor;

  constructor() {
    effect(() => {
      const note = this.note();
      this.onNoteChange(note);

    });

    effect(() => {
      const editable = this.editable();
      this.editor.setEditable(editable);
    })
  }

  onNoteChange(note: Note | null) {
    if (!note) {
      this.editable.set(true);
      this.title.set('Untitled');
      this.notebookId.set('');
    } else {
      this.editable.set(false);
      this.title.set(note.title);
      this.notebookId.set(note.notebookId);
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
  }

  onEdit() {
    this.editable.set(true);
  }

  onSave() {
    this.noteSaved.emit({
      title: this.title(),
      content: this.editor.getHTML(),
      notebookId: this.notebookId(),
    });
    this.editable.set(false);
  }

  onNotebookChange(id: string) {
    this.notebookId.set(id);
  };
}

