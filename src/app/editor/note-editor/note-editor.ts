import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { Note } from '../../note';
import { EditorFactory } from '../editor';
import { TiptapFactory } from '../tiptap-factory';
import { Editor } from '../editor';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  heroBookOpen,
  heroClock,
  heroClipboardDocumentCheck,
  heroPaperClip,
  heroArchiveBoxArrowDown,
  heroPencilSquare,
  heroPlus,
  heroBell,
  heroDocumentText,
} from '@ng-icons/heroicons/outline';
import { Notebook } from '@app/notebook';
import { TagRepository } from '@app/persistence/tag-repository';
import { TagStore } from '@app/stores/tag-store';
import { Tag } from '@app/tag';
import { TagPickerModal } from '@app/components/tag-picker-modal/tag-picker-modal';
import { ReminderPickerModal } from '@app/components/reminder-picker-modal/reminder-picker-modal';
import { ReminderService } from '@app/misc/reminder-service';
import { NoteRepository } from '@app/persistence/note-repository';


export type NoteSavedEvent =
  Pick<Note, 'title' | 'content' | 'notebookId'> &
  Partial<Pick<Note, 'tagIds'>> ;


@Component({
  selector: 'nevernote-note-editor',
  providers: [provideIcons({
    heroBookOpen, heroClock,
    heroClipboardDocumentCheck, heroPaperClip, heroBell,
    heroArchiveBoxArrowDown, heroPencilSquare, heroPlus, heroDocumentText,
  })],
  imports: [DatePipe, FormsModule, NgIcon, TagPickerModal, ReminderPickerModal],
  templateUrl: './note-editor.html',
})
export class NoteEditor {
  tagStore = inject(TagStore);
  tagRepo = inject(TagRepository);
  noteRepo = inject(NoteRepository);
  reminderService = inject(ReminderService);

  factory: EditorFactory = inject(TiptapFactory);

  note = input.required<Note | null>();
  notebooks = input.required<Notebook[]>();

  tags = computed(this.tagStore.contents);

  protected readonly container = viewChild.required('editorContainer');

  title = signal('Untitled');
  tagIds = signal([] as string[]);
  notebookId = signal('');
  editable = signal(false);

  reminderModalOpen = signal(false);

  activeTags = computed(() => this
    .tagIds()
    .map(id => this.tags().find(t => t.id === id))
    .filter(Boolean) as Tag[]
  );
  tagPickerOpen = signal(false);

  editor!: Editor;

  noteSaved = output<NoteSavedEvent>();

  constructor() {
    effect(() => {
      const note = this.note();
      this.onNoteChange(note);

    });

    effect(() => {
      const editable = this.editable();
      this.editor.setEditable(editable);
    })
  }

  onNoteChange(note: Note | null) {
    if (!note) {
      console.debug("Note is null, yet editor is rendered.");
      return;
    }

    this.editable.set(false);
    this.title.set(note.title);
    this.notebookId.set(note.notebookId);
    this.tagIds.set(note.tagIds);

    const editor = this.factory.make({
      contentHTML: note ? note.content : '',
      editable: note ? false : true,
    });

    if (this.editor) {
      this.editor.destroy();
    }

    editor.mount(this.container() as ElementRef<HTMLElement>);
    this.editor = editor;
  }

  onEdit() {
    this.editable.set(true);
  }

  onSave() {
    this.noteSaved.emit({
      title: this.title(),
      content: this.editor.getHTML(),
      notebookId: this.notebookId(),
    });
    this.editable.set(false);
  }

  onTagAdded(tag: Tag) {
    this.tagIds.set([ tag.id, ...this.tagIds() ]);
  }

  onTagRemoved(tag: Tag) {
    this.tagIds.set(
      this.tagIds().filter(id => id === tag.id)
    );
  }

  onTagCreated(tagName: string) {
    this
      .tagRepo
      .create({ name: tagName })
      .subscribe(t => {
        this.tagStore.add(t);
        this.tagIds.set([ t.id, ...this.tagIds()]);
      });
  }

  onNotebookChange(id: string) {
    this.notebookId.set(id);
  };

  onReminderConfirmed(date: Date) {
    const note = this.note();
    if (!note) return;

    this
      .noteRepo
      .update(note.id, { reminderAt: date })
      .subscribe(n =>
        this.reminderService.schedule(n)
      );
  }

  onReminderRemoved() {
    const note = this.note();
    if (!note) return;

    this
      .noteRepo
      .update(note.id, { reminderAt: undefined })
      .subscribe(n => {
        this.reminderService.cancel(n.id);
        this.reminderModalOpen.set(false);
      });
  }
}

