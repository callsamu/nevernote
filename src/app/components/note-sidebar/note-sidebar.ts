import { Component, inject, input, output } from '@angular/core';
import { Notebook } from '@app/notebook';
import { NoteStore } from '@app/stores/note-store';
import { NotebookStore } from '@app/stores/notebook-store';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  heroDocumentText, heroBookOpen, heroBookmark, heroTag,
  heroInformationCircle, heroMagnifyingGlass, heroTrash, heroPlus,
} from '@ng-icons/heroicons/outline';


@Component({
  selector: 'nevernote-note-sidebar',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({
    heroDocumentText, heroBookOpen, heroBookmark, heroTag,
    heroInformationCircle, heroMagnifyingGlass, heroTrash, heroPlus,
  })],
  templateUrl: './note-sidebar.html',
})
export class NoteSidebar {
  notebookStore = inject(NotebookStore);
  noteStore = inject(NoteStore);

  deleteClicked = output<Notebook>();
  createClicked = output<void>();

  onNotebookSelect(nb: Notebook) {
    console.info("Selected Notebook on Sidebar: ", nb);
    this.notebookStore.selected.set(nb);
    this.noteStore.listByNotebookId(nb.id);
  }
}
