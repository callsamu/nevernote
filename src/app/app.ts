import { Component, computed, inject, NgZone, signal, WritableSignal } from '@angular/core';

import { Note } from './note';
import { IDBNoteRepository } from './persistence/idb/idb-note-repository';

import { Notebook } from './notebook';
import { NotebookRepository } from './persistence/notebook-repository';
import { IDBNotebookRepository } from './persistence/idb/idb-notebook-repository';
import { NoteSidebar } from './components/note-sidebar/note-sidebar';
import { NoteList } from './components/note-list/note-list';
import { NoteView } from './components/note-view/note-view';
import { NotebookCreateModal } from './components/notebook-create-modal/notebook-create-modal';
import { NotebookDeleteModal } from './components/notebook-delete-modal/notebook-delete-modal';
import { NoteRepository } from './persistence/note-repository';
import { NoteSavedEvent } from './editor/note-editor/note-editor';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { map, Observable } from 'rxjs';

type MobileView = 'list' | 'editor';

@Component({
  selector: 'app-root',
  imports: [
    NoteSidebar, NoteList, NoteView, NotebookCreateModal, NotebookDeleteModal, NgIcon
  ],
  providers: [
    provideIcons({ heroXMark }),
    { provide: NoteRepository,     useClass: IDBNoteRepository     },
    { provide: NotebookRepository, useClass: IDBNotebookRepository }
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  noteRepo = inject(NoteRepository);
  notebookRepo = inject(NotebookRepository);
  ngZone = inject(NgZone);

  private screenWidth  = signal(window.innerWidth);
  isDesktop = computed(() => this.screenWidth() >= 1024);

  notes = signal<Note[]>([]);
  notebooks = signal<Notebook[]>([]);

  selectedNote = signal<Note | null>(null);
  selectedNotebook = signal<Notebook | null>(null);

  notebookToDelete = signal<Notebook | null>(null);
  newNotebookModalOpen = signal(false);

  editorOpen = signal(false);

  mobileView = signal<MobileView>('list');
  drawerOpen = signal(false);


  ngOnInit() {
    window.addEventListener('resize', () => {
      this.ngZone.run(() => this.screenWidth.set(window.innerWidth));
    });

    this.noteRepo.list({ sort: "title" }).subscribe(({ items }) => {
      this.notes.set(items);
    });

    this.notebookRepo.list({ sort: 'name' }).subscribe(({ items }) => {
      this.notebooks.set(items);
    });
  }

  select(note: Note) {
    this.openEditor();
    this.selectedNote.set(note);
  }

  onCapture() {
    this.openEditor();
    this.selectedNote.set(null);
  }

  openEditor() {
    this.editorOpen.set(true);
    this.mobileView.set('editor');
    console.log('editor');
  }

  closeEditor() {
    this.editorOpen.set(false);
    this.mobileView.set('list');
  }

  onNoteSaved(event: NoteSavedEvent) {
    let note$: Observable<Note>;
    const selected = this.selectedNote();

    if (!selected) {
      note$ = this.noteRepo.create({
        ...event,
        notebookId: '',
      });
    } else {
      note$ = this.noteRepo.update(selected.id, {
        ...event,
        notebookId: ''
      });
    }

    note$.subscribe(note => {
      this.selectedNote.set(note);
      this.noteRepo.list({
        sort: 'updatedAt'
      }).subscribe(notes => this.notes.set(notes.items));
    });
  }

  onCreateNotebook(input: { name: string; description?: string }) {
    this.notebookRepo.create(input).subscribe(nb => {
      this.notebooks.update(list => [...list, nb]);
      this.newNotebookModalOpen.set(false);
    });
  }


  onDeleteNotebook(notebook: Notebook) {
    this.notebookRepo.remove(notebook.id).subscribe(() => {
      this.notebooks.update(list => list.filter(n => n.id !== notebook.id));

      if (this.selectedNotebook()?.id === notebook.id) {
        this.selectedNotebook.set(null);
      }
    });
  }

  selectNotebook(nb: Notebook)  { this.selectedNotebook.set(nb); }
}
