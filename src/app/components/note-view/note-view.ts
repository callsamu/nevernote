import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Note } from '@app/note';
import { NoteEditor, NoteSavedEvent } from '@app/editor/note-editor/note-editor';

import {
  heroBookOpen, heroPlus, heroChevronLeft,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'nevernote-note-view',
  standalone: true,
  imports: [NgIconComponent, NoteEditor],
  viewProviders: [provideIcons({ heroBookOpen, heroPlus, heroChevronLeft })],
  templateUrl: './note-view.html',
})
export class NoteView {
  note = input<Note | null>(null);
  open = input.required<boolean>();

  editorClosed = output<void>();
  noteSaved = output<NoteSavedEvent>();
}
