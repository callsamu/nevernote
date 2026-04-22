import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe }                  from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass, heroBars3, heroSquares2x2,
  heroPlus, heroDocumentText,
  heroTrash,
  heroArrowUturnLeft,
  heroMapPin,
} from '@ng-icons/heroicons/outline';
import { Note } from '@app/note';
import { SafeHTMLPipe } from '@app/safe-html-pipe';
import { NoteStore } from '@app/stores/note-store';
import { NoteTrasher } from '@app/facades/note-trasher';

@Component({
  selector: 'nevernote-note-list',
  standalone: true,
  imports: [NgIconComponent, DatePipe, SafeHTMLPipe],
  viewProviders: [provideIcons({
    heroMagnifyingGlass, heroBars3, heroSquares2x2, heroPlus, heroDocumentText,
    heroTrash, heroArrowUturnLeft,heroMapPin
  })],
  templateUrl: './note-list.html',
})
export class NoteList {
  noteStore = inject(NoteStore);
  trasher = inject(NoteTrasher);

  title = input<string>('Notes');

  notes = computed(this.noteStore.contents);
  selectedNote = computed(this.noteStore.selected);

  noteSelected = output<Note>();
  newNote = output<void>();
  menuClicked = output<void>();

  onTrashToggle(note: Note) {
    if (note.trashed) {
      this.trasher.restore(note.id)
    } else {
      this.trasher.trash(note.id);
    }
  }

  onPinToggle(note: Note) {
    this.noteStore.update(note.id, { pinned: !note.pinned });
  }
}

