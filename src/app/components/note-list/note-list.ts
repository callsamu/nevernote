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
import { SafeHTMLPipe } from '@app/pipes/safe-html-pipe';
import { NoteStore } from '@app/stores/note-store';
import { NoteTrasher } from '@app/facades/note-trasher';
import { NoteRepository } from '@app/persistence/note-repository';


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
  noteRepo = inject(NoteRepository);
  trasher = inject(NoteTrasher);

  title = input.required<string>();
  notes = input.required<Note[]>();
  selectedNote = input.required<Note | null>();

  noteSelected = output<Note>();
  newNote = output<void>();
  menuClicked = output<void>();

  onTrash(note: Note) {
    this
      .trasher
      .trash(note.id)
      .subscribe(n => this.noteStore.remove(n.id));
  }

  onPinToggle(note: Note) {
    this
      .noteRepo
      .update(note.id, { pinned: !note.pinned })
      .subscribe(n => this.noteStore.update(n));
  }
}

