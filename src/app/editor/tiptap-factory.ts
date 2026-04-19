import { ElementRef, Injectable } from '@angular/core';
import { Editor as TiptapEditor } from '@tiptap/core';
import { EditorFactory, Editor, EditorOpts } from './editor';
import StarterKit from '@tiptap/starter-kit';

@Injectable({
  providedIn: 'root',
})
export class TiptapFactory implements EditorFactory {
  make(opts: EditorOpts): Editor {
    const tiptap = new TiptapEditor({
      element: null,
      content: opts.contentHTML,
      editable: opts.editable,
      extensions: [StarterKit]
    })

    return {
      mount(element: ElementRef<HTMLElement>) {
        tiptap.mount(element.nativeElement);
        return this;
      },
      destroy() {
        tiptap.unmount();
        tiptap.destroy();
        return this;
      },
      getHTML() {
        return tiptap.getHTML();
      },
      setEditable(editable: boolean) {
        tiptap.setEditable(editable);
        return this;
      }
    }
  }
}
