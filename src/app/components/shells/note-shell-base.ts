import { Component, computed, effect, inject, OnInit, output, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router';
import { toSignal }                                 from '@angular/core/rxjs-interop';
import { map }                                      from 'rxjs';
import { Note }                                     from '@app/note';
import { NoteStore }                                from '@app/stores/note-store';
import { NotebookStore }                            from '@app/stores/notebook-store';
import { NoteSavedEvent }                           from '@app/editor/note-editor/note-editor';
import { NoteCreateInput, NoteRepository } from '@app/persistence/note-repository';
import { NoteView } from '../note-view/note-view';
import { NoteList } from '../note-list/note-list';
import { LayoutStore } from '@app/layout-store';

@Component({
  templateUrl: './note-shell.html',
  imports: [NoteView, NoteList],
  host: {
    'class': 'w-full'
  }
})
export abstract class NoteShellBase {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected noteStore = inject(NoteStore);
  protected notebookStore = inject(NotebookStore);
  protected noteRepo = inject(NoteRepository);
  protected layout = inject(LayoutStore);

  readonly noteId = toSignal(
    this.route.params.pipe(map(p => p['noteId'] ?? null)),
    { initialValue: null }
  );

  readonly isDesktop = signal(true);
  readonly menuClicked = output<void>();

  readonly selectedNote = computed(() =>
    this.noteId()
      ? (this.noteStore.contents().find(n => n.id === this.noteId()) ?? null)
      : null
  );

  readonly editorOpen = computed(() => this.noteId() !== null);

  abstract readonly listTitle: Signal<string>;
  abstract select(note: Note): void;
  abstract closeEditor(): void;
  abstract onCapture(): void;

  constructor() {
    effect(() => {
      this.loadNotes();
    });
  }

  protected abstract loadNotes(): void;

  onNoteSaved(event: NoteSavedEvent) {
    const selected = this.selectedNote();
    if (!selected) {
      this
        .noteRepo
        .create({ ...event, tagIds: [],})
        .subscribe(this.noteStore.add);
    } else {
      this
        .noteRepo
        .update(selected.id, { ...event })
        .subscribe(n => this.noteStore.update(n));
    }
  }

  protected createNote(opts?: Partial<NoteCreateInput>) {
    this
      .noteRepo
      .create({
        title: 'Untitled',
        content: '',
        notebookId: '',
        tagIds: [],
        ...opts
      })
      .subscribe(note => {
        this.noteStore.add(note);
        this.select(note);
      });
  }
}


