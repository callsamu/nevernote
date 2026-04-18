import { ElementRef, Signal } from '@angular/core';

/*
* 'this' é usado como valor de retorno para possibilitar
* chamadas encadeadas do método
* >   editor.mount(el).setEditable(true);
*/
export interface Editor {
  mount(element: ElementRef<HTMLElement>): this;
  setEditable(editable: boolean): this;
  destroy(): this;
}

export interface EditorOpts {
  contentHTML?: string;
  editable?: boolean;
}

export interface EditorFactory {
  make(opts: EditorOpts): Editor;
}
