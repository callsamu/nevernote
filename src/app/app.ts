// app.ts
import {
  Component, computed, inject, NgZone, signal, OnInit, OnDestroy
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark }            from '@ng-icons/heroicons/outline';

import { Notebook }              from './notebook';
import { NotebookStore }         from './stores/notebook-store';
import { NoteStore }             from './stores/note-store';
import { NoteSidebar }           from './components/note-sidebar/note-sidebar';
import { NotebookCreateModal }   from './components/notebook-create-modal/notebook-create-modal';
import { NotebookDeleteModal }   from './components/notebook-delete-modal/notebook-delete-modal';
import { LayoutStore } from './layout-store';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NoteSidebar,
    NotebookCreateModal,
    NotebookDeleteModal,
    NgIcon,
  ],
  providers: [provideIcons({ heroXMark })],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private router = inject(Router);

  notebookStore = inject(NotebookStore);
  noteStore = inject(NoteStore);
  layout = inject(LayoutStore);

  newNotebookModalOpen = signal(false);
  notebookToDelete = signal<Notebook | null>(null);

  ngOnInit() {
    this.layout.watchResize();
    this.router.events.subscribe(() => this.layout.closeDrawer());
  }

  ngOnDestroy() {
    this.layout.unwatchResize();
  }

  onCreateNotebook(input: { name: string; description?: string }) {
    this.notebookStore.create(input.name, input.description);
    this.newNotebookModalOpen.set(false);
  }

  onDeleteNotebook(nb: Notebook) {
    this.notebookStore.remove(nb.id);
    this.router.navigate(['/notes']);
  }
}
