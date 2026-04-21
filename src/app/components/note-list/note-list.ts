import { Component, input, output } from '@angular/core';
import { DatePipe }                  from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass, heroBars3, heroSquares2x2,
  heroPlus, heroDocumentText,
} from '@ng-icons/heroicons/outline';
import { Note } from '@app/note';
import { SafeHTMLPipe } from '@app/safe-html-pipe';

@Component({
  selector: 'nevernote-note-list',
  standalone: true,
  imports: [NgIconComponent, DatePipe, SafeHTMLPipe],
  viewProviders: [provideIcons({
    heroMagnifyingGlass, heroBars3, heroSquares2x2, heroPlus, heroDocumentText,
  })],
  templateUrl: './note-list.html',
})
export class NoteList {
  title = input<string>('Notes');
  notes = input.required<Note[]>();
  selectedNote = input<Note | null>(null);

  noteSelected = output<Note>();
  newNote = output<void>();
  menuClicked = output<void>();
}

