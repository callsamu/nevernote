import { Component, computed, inject, InjectionToken, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NoteTrasher } from '@app/facades/note-trasher';
import { LayoutStore } from '@app/layout-store';
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
  imports: [NgIconComponent, RouterModule],
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
  router = inject(Router);
  layout = inject(LayoutStore);

  notebooks = input<Notebook[]>();
  selectedNotebook = input.required<Notebook | null>();

  deleteClicked = output<Notebook>();
  createClicked = output<void>();
  notebookSelected = output<Notebook>();

  showTagForm = signal(false);
  newTagName = signal('');

  trashSelected = signal(false);

  noteCount = computed(() => this.notebookStore.contents().length);

  createTag() {
    this.trashSelected.set(false);

    const name = this.newTagName().trim();
    if (name) this.tagStore.create(name);
    this.newTagName.set('');
    this.showTagForm.set(false);
  }

  allNotes() {
    this.router.navigate(['/notes']);
  }

  onNotebookSelect(nb: Notebook) {
    this.router.navigate(['/notebooks', nb.id]);
  }

  onTagSelect(tag: Tag) {
  }

  onTrashSelect() {
    this.router.navigate(['/trash']);
  }
}
