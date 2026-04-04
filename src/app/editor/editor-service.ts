import { Injectable, WritableSignal, signal } from '@angular/core';
import { Editor } from '@tiptap/core';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  protected editor: WritableSignal<Editor | null> = signal(null);

  load(newInstance: Editor): void {
    this.editor.set(newInstance);
  }

  remove() {
    this.editor.set(null);
  }

  getHTMLContent(): string | undefined {
    return this.editor()?.getHTML();
  }

}
