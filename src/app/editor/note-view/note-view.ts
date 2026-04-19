import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { Note } from '../../note';
import { EditorFactory } from '../editor';
import { TiptapFactory } from '../tiptap-factory';
import { Editor } from '../editor';
import { DatePipe } from '@angular/common';

export type NoteDraft = Pick<Note, 'title' | 'content'>;

@Component({
  selector: 'nevernote-note-view',
  imports: [DatePipe],
  templateUrl: './note-view.html',
})
export class NoteView {
  note = input.required<Note | null>();
  noteSaved = output<NoteDraft>();

  editable = signal(false);
  protected readonly container = viewChild.required('editorContainer');

  title = signal('Untitled');
  wordCount = computed(() => /* count from editorContainer */ 0);

  editor!: Editor;
  factory: EditorFactory = inject(TiptapFactory);

  constructor() {
    effect(() => {
      const note = this.note();

      if (!note) {
        this.editable.set(true);
      } else {
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

