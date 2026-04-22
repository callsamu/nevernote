import { Component, computed, inject, InjectionToken, input, output, signal } from '@angular/core';
import { NoteTrasher } from '@app/facades/note-trasher';
import { Notebook } from '@app/notebook';
import { NoteStore } from '@app/stores/note-store';
import { NotebookStore } from '@app/stores/notebook-store';
import { TagStore } from '@app/stores/tag-store';
import { Tag } from '@app/tag';
import { ThemeToggler } from '@app/theme-toggler';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  heroDocumentText, heroBookOpen, heroBookmark, heroTag,
  heroInformationCircle, heroMagnifyingGlass, heroTrash, heroPlus,
  heroSun,
  heroMoon,
} from '@ng-icons/heroicons/outline';


@Component({
  selector: 'nevernote-note-sidebar',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({
    heroDocumentText, heroBookOpen, heroBookmark, heroTag,
    heroInformationCircle, heroMagnifyingGlass, heroTrash, heroPlus,
    heroSun, heroMoon
  })],
  templateUrl: './note-sidebar.html',
})
export class NoteSidebar {
  notebookStore = inject(NotebookStore);
  tagStore = inject(TagStore);
  noteStore = inject(NoteStore);
  theme = inject(ThemeToggler);
  trash = inject(NoteTrasher);

  deleteClicked = output<Notebook>();
  createClicked = output<void>();

  showTagForm = signal(false);
  newTagName = signal('');

  trashSelected = signal(false);

  noteCount = computed(() => this.notebookStore.contents().length);

  onNotebookSelect(nb: Notebook) {
    this.trashSelected.set(false);

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
    this.trashSelected.set(false);

    const name = this.newTagName().trim();
    if (name) this.tagStore.create(name);
    this.newTagName.set('');
    this.showTagForm.set(false);
  }

  onTagSelect(tag: Tag) {
    if (tag.id === this.tagStore.selected()?.id) {
      this.tagStore.selected.set(null);
      this.noteStore.listAll();
    } else {
      this.tagStore.selected.set(tag);
      this.noteStore.listByTagId(tag.id);
    }
  }

  onTrashSelect() {
    if (this.trashSelected()) {
      this.trashSelected.set(false);
      this.noteStore.listAll();
    } else {
      this.trashSelected.set(true);
      this.trash.listTrashed();
    }
  }
}
