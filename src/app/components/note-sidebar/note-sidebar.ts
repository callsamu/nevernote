import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Notebook } from '@app/notebook';
import { NoteStore } from '@app/stores/note-store';
import { NotebookStore } from '@app/stores/notebook-store';
import { TagStore } from '@app/stores/tag-store';
import { Tag } from '@app/tag';
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
  tagStore = inject(TagStore);
  noteStore = inject(NoteStore);

  deleteClicked = output<Notebook>();
  createClicked = output<void>();

  showTagForm = signal(false);
  newTagName = signal('');

  noteCount = computed(() => this.notebookStore.contents().length);

  onNotebookSelect(nb: Notebook) {
    console.info("Selected Notebook on Sidebar: ", nb);

    if (nb.id === this.notebookStore.selected()?.id)  {
      this.notebookStore.selected.set(null);
      this.noteStore.listByNotebookId('');
    } else {
      this.notebookStore.selected.set(nb);
      this.noteStore.listByNotebookId(nb.id);
    }
  }
  createTag() {
    const name = this.newTagName().trim();
    if (name) this.tagStore.create(name);
    this.newTagName.set('');
    this.showTagForm.set(false);
  }

  onTagSelect(tag: Tag) {
    this.tagStore.selected.set(tag);
    this.noteStore.listByTagId(tag.id);
  }
}
