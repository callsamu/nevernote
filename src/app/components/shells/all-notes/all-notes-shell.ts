import { Component, computed, input, output } from '@angular/core';
import { NgZone, signal } from '@angular/core';
import { Note } from '@app/note';
import { NoteShellBase } from '../note-shell-base';
import { NoteList } from '@app/components/note-list/note-list';
import { NoteView } from '@app/components/note-view/note-view';

@Component({
  selector: 'nevernote-all-notes-shell',
  imports: [NoteList, NoteView],
  templateUrl: '../note-shell.html',
})
export class AllNotesShell extends NoteShellBase {
  readonly listTitle = signal('All Notes');

  protected loadNotes() {
    this
      .noteRepo
      .list({ sort: 'updatedAt' })
      .subscribe(({ items }) => this.noteStore.set(items));
  }

  onCapture(): void {
    this.createNote();
  }

  select(note: Note) {
    this.router.navigate(['/notes', note.id]);
  }

  closeEditor() {
    this.router.navigate(['/notes']);
  }
}
