import { Component, computed, input, output } from '@angular/core';
import { toSignal }      from '@angular/core/rxjs-interop';
import { map }           from 'rxjs';
import { Note }          from '@app/note';
import { NoteShellBase } from '../note-shell-base';
import { NoteList } from '@app/components/note-list/note-list';
import { NoteView } from '@app/components/note-view/note-view';

@Component({
  selector: 'nevernote-notebook-shell',
  templateUrl: '../note-shell.html',
  imports: [NoteList, NoteView],
})
export class NotebookShell extends NoteShellBase {

  readonly notebookId = toSignal(
    this.route.params.pipe(map(p => p['notebookId'])),
    { initialValue: '' }
  );

  readonly listTitle = computed(() => {
    const nb = this.notebookStore.contents()
      .find(n => n.id === this.notebookId());
    return nb?.name ?? 'Notebook';
  });

  protected loadNotes() {
    const id = this.notebookId();
    if (id) {
      this
        .noteRepo
        .list({ notebookId: id, sort: 'updatedAt' })
        .subscribe(({ items }) => this.noteStore.set(items));
    }
  }

  select(note: Note) {
    this.router.navigate(['/notebooks', this.notebookId(), note.id]);
  }

  onCapture(): void {
    this.createNote({ notebookId: this.notebookId() })
  }

  closeEditor() {
    this.router.navigate(['/notebooks', this.notebookId()]);
  }
}
