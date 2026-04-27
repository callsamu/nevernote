import { TrashList } from "@app/components/trash-list/trash-list";
import { NoteShellBase } from "../note-shell-base";
import { NoteView } from "@app/components/note-view/note-view";
import { Component, inject, signal } from "@angular/core";
import { Note } from "@app/note";
import { NoteTrasher } from "@app/facades/note-trasher";


@Component({
  selector: 'nevernote-trash-shell',
  imports: [TrashList, NoteView],
  templateUrl: './trash-shell.html',
})
export class TrashShell extends NoteShellBase {
  trash = inject(NoteTrasher);

  readonly listTitle = signal('Trash');

  protected loadNotes() {
    this
      .noteRepo
      .list({ trashed: true, sort: 'updatedAt' })
      .subscribe(({ items }) => this.noteStore.set(items));
  }

  onCapture(): void {}

  onRestore(note: Note) {
    this
      .trash
      .restore(note.id)
      .subscribe(n => this.noteStore.remove(n.id));
  }

  onDelete(note: Note) {
    this
      .trash
      .restore(note.id)
      .subscribe(n => this.noteStore.remove(n.id));
  }

  onEmptyTrash() {
    this
      .trash
      .empty()
      .subscribe(() => this.noteStore.set([]));
  }

  select(note: Note): void {
    this
      .router
      .navigate(['trash', note.id]);
  }

  closeEditor(): void {
    this.router.navigate(['/trash']);
  }
}
