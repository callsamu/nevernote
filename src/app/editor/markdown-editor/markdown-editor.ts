import { Component, ElementRef, inject, viewChild, input } from '@angular/core';
import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';

import { EditorService } from './../editor-service';

@Component({
  selector: 'nevernote-markdown-editor',
  imports: [],
  template: `<div class="prose prose-sm" #editorContainer></div>`,
})
export class MarkdownEditor {
  contentEditable = input<boolean>(true);
  content = input<string>(' ');

  protected readonly containerRef = viewChild<ElementRef<HTMLElement>>('editorContainer');

  service: EditorService = inject(EditorService);

  ngAfterViewInit() {
    const ref = this.containerRef();
    const isEditable = this.contentEditable();

    if (!ref) {
      throw new Error("editor: container element ref is null");
    }

    const editor = new Editor({
      element: ref.nativeElement,
      extensions: [StarterKit],
      editable: isEditable,
      content: this.content(),
      editorProps: {
        attributes: {
          class: 'prose prose-sm'
        }
      },
    });

    if (isEditable) {
      this.service.load(editor);
      editor.on('destroy', this.service.remove);
    }
  }
}
