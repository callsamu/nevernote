import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal }      from '@angular/core/rxjs-interop';
import { map }           from 'rxjs';
import { Note }          from '@app/note';
import { NoteShellBase } from '../note-shell-base';
import { NoteList } from '@app/components/note-list/note-list';
import { NoteView } from '@app/components/note-view/note-view';
import { TagStore } from '@app/stores/tag-store';

@Component({
  selector: 'nevernote-notebook-shell',
  templateUrl: '../note-shell.html',
  imports: [NoteList, NoteView],
})
export class TagShell extends NoteShellBase {
  tagStore = inject(TagStore);

  readonly tagId = toSignal(
    this.route.params.pipe(map(p => p['tagId'])),
    { initialValue: '' }
  );

  readonly listTitle = computed(() => {
    const tag = this.tagStore.contents()
      .find(n => n.id == this.tagId());
    return tag ? `# ${tag.name}` : '# Tag';
  });

  protected loadNotes() {
    const id = this.tagId();
    if (id) {
      this
        .noteRepo
        .list({ tagIds: [id], sort: 'updatedAt' })
        .subscribe(({ items }) => this.noteStore.set(items));
    }
  }

  select(note: Note) {
    this.router.navigate(['/tags', this.tagId(), note.id]);
  }

  onCapture(): void {
    this.createNote({ tagIds: [this.tagId()] });
  }

  closeEditor() {
    this.router.navigate(['/notebooks', this.tagId()]);
  }
}
