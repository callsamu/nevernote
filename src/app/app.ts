import { Component, computed, effect, inject, NgZone, signal, WritableSignal } from '@angular/core';

import { Note } from './note';

import { Notebook } from './notebook';
import { NotebookRepository } from './persistence/notebook-repository';
import { NoteSidebar } from './components/note-sidebar/note-sidebar';
import { NoteList } from './components/note-list/note-list';
import { NoteView } from './components/note-view/note-view';
import { NotebookCreateModal } from './components/notebook-create-modal/notebook-create-modal';
import { NotebookDeleteModal } from './components/notebook-delete-modal/notebook-delete-modal';
import { NoteSavedEvent } from './editor/note-editor/note-editor';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { NotebookStore } from './stores/notebook-store';
import { NoteStore } from './stores/note-store';

type MobileView = 'list' | 'editor';

@Component({
  selector: 'app-root',
  imports: [
    NoteSidebar, NoteList, NoteView, NotebookCreateModal, NotebookDeleteModal, NgIcon
  ],
  providers: [
    provideIcons({ heroXMark }),
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  notebookStore = inject(NotebookStore);
  noteStore = inject(NoteStore);
  notebookRepo = inject(NotebookRepository);
  ngZone = inject(NgZone);

  private screenWidth  = signal(window.innerWidth);
  isDesktop = computed(() => this.screenWidth() >= 1024);

  notebookToDelete = signal<Notebook | null>(null);
  newNotebookModalOpen = signal(false);

  editorOpen = signal(false);

  mobileView = signal<MobileView>('list');
  drawerOpen = signal(false);

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.ngZone.run(() => this.screenWidth.set(window.innerWidth));
    });
  }

  select(note: Note) {
    this.openEditor();
    this.noteStore.selected.set(note);
  }

  onCapture() {
    this.openEditor();
    this.noteStore.selected.set(null);
  }

  openEditor() {
    this.editorOpen.set(true);
    this.mobileView.set('editor');
  }

  closeEditor() {
    this.editorOpen.set(false);
    this.mobileView.set('list');
  }

  onNoteSaved(event: NoteSavedEvent) {
    const selected = this.noteStore.selected();

    if (!selected) {
      this.noteStore.create(event.title, event.content, event.notebookId);
    } else {
      this.noteStore.update(selected.id, { ...event });
    }
  }

  onCreateNotebook(input: { name: string; description?: string }) {
    this.notebookStore.create(input.name, input.description);
  }

  onDeleteNotebook(nb: Notebook) {
    this.notebookStore.remove(nb.id)
  }
}
