// trash-note-list.component.ts
import { Component, input, output, signal } from '@angular/core';
import { DatePipe }                          from '@angular/common';
import { NgIconComponent, provideIcons }     from '@ng-icons/core';
import {
  heroBars3,
  heroTrash,
  heroMagnifyingGlass,
  heroArrowUturnLeft,
  heroXMark,
  heroExclamationTriangle,
} from '@ng-icons/heroicons/outline';
import { Note }         from '@app/note';
import { SafeHTMLPipe } from '@app/pipes/safe-html-pipe';

@Component({
  selector: 'nevernote-trash-list',
  standalone: true,
  imports: [NgIconComponent, DatePipe, SafeHTMLPipe],
  viewProviders: [provideIcons({
    heroBars3,
    heroTrash,
    heroMagnifyingGlass,
    heroArrowUturnLeft,
    heroXMark,
    heroExclamationTriangle,
  })],
  templateUrl: './trash-list.html',
})
export class TrashList {
  notes = input.required<Note[]>();
  selectedNote = input<Note | null>(null);

  noteSelected = output<Note>();
  restoreNote = output<Note>();
  deleteNote = output<Note>();
  emptyTrash = output<void>();
  menuClicked = output<void>();
  search = output<string>();

  noteToDelete = signal<Note | null>(null);
  emptyTrashModalOpen = signal(false);

  onEmptyTrash() {
    if (this.notes().length === 0) return;
    this.emptyTrashModalOpen.set(true);
  }
}

