import { Component, input, output } from '@angular/core';
import { Notebook } from '@app/notebook';
import { NotebookListOptions } from '@app/persistence/notebook-repository';
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
  notebooks        = input.required<Notebook[]>();
  selectedNotebook = input<Notebook | null>(null);
  noteCount        = input<number>(0);

  notebookSelected = output<Notebook>();
  createClicked    = output<void>();
  deleteClicked    = output<Notebook>();
}
