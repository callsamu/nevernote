import { Component, computed, inject, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Note } from '@app/note';
import { NoteEditor, NoteSavedEvent } from '@app/editor/note-editor/note-editor';

import {
  heroBookOpen, heroPlus, heroChevronLeft,
} from '@ng-icons/heroicons/outline';
import { NoteStore } from '@app/stores/note-store';
import { NotebookStore } from '@app/stores/notebook-store';

@Component({
  selector: 'nevernote-note-view',
  standalone: true,
  imports: [NgIconComponent, NoteEditor],
  viewProviders: [provideIcons({ heroBookOpen, heroPlus, heroChevronLeft })],
  templateUrl: './note-view.html',
})
export class NoteView {
  noteStore = inject(NoteStore);
  notebookStore = inject(NotebookStore);

  open = input.required<boolean>();
  notebooks = computed(this.notebookStore.contents);

  editorClosed = output<void>();
  noteSaved = output<NoteSavedEvent>();
}
