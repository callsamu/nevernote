import { ElementRef, Injectable, signal } from '@angular/core';
import { Editor as TiptapEditor } from '@tiptap/core';
import { EditorFactory, Editor, EditorOpts } from './editor';
import StarterKit from '@tiptap/starter-kit';
import { CharacterCount } from '@tiptap/extensions';

@Injectable({
  providedIn: 'root',
})
export class TiptapFactory implements EditorFactory {

  make(opts: EditorOpts): Editor {
    const words = signal(0);

    const tiptap = new TiptapEditor({
      element: null,
      content: opts.contentHTML,
      editable: opts.editable,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3, 4]
          }
        }),
        CharacterCount,
      ],
      editorProps: {
        attributes: {
          class: 'prose prose-sm'
        }
      },
      onUpdate({ editor }) {
        console.info("edit");
        words.set(editor.storage.characterCount.words());
      }
    })

    return {
      words: words.asReadonly(),
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
