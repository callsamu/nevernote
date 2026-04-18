import { Component, computed, effect, ElementRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { Note } from '../../note';
import { EditorFactory } from '../editor';
import { TiptapFactoryService } from '../tiptap-factory-service';
import { Editor } from '../editor';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nevernote-note-view',
  imports: [DatePipe],
  templateUrl: './note-view.html',
})
export class NoteView {
  note = input.required<Note | null>();
  noteSaved = output<Note>();

  editable = signal(false);
  protected readonly container = viewChild.required('editorContainer');
  wordCount = computed(() => /* count from editorContainer */ 0);

  editor!: Editor;
  factory: EditorFactory = inject(TiptapFactoryService);

  constructor() {
    effect(() => {
      const note = this.note();

      if (!note) {
        this.editable.set(true);
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
    this.editable.set(false);
  }

  onTitleChange(v: string) { /* patch note signal */ }
}

