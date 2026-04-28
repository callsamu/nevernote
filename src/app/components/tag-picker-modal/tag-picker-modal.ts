import { Component, computed, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons }              from '@ng-icons/core';
import {
  heroXMark,
  heroPlus,
  heroMagnifyingGlass,
  heroTag,
  heroCheck,
} from '@ng-icons/heroicons/outline';
import { Tag } from '@app/tag';

@Component({
  selector: 'nevernote-tag-picker-modal',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({
    heroXMark, heroPlus, heroMagnifyingGlass, heroTag, heroCheck,
  })],
  templateUrl: './tag-picker-modal.html',
})
export class TagPickerModal {

  open = input.required<boolean>();
  tags = input.required<Tag[]>();
  selectedIds = input<string[]>([]);

  dismissed = output<void>();
  tagAdded = output<Tag>();
  tagRemoved = output<Tag>();
  tagCreated = output<string>();

  query = signal('');

  filteredTags = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.tags();
    return this.tags().filter(t => t.name.toLowerCase().includes(q));
  });

  canCreate = computed(() => {
    const q = this.query().trim();
    if (!q) return false;
    return !this.tags().some(t => t.name.toLowerCase() === q.toLowerCase());
  });

  isSelected(tag: Tag): boolean {
    return this.selectedIds().includes(tag.id);
  }

  toggleTag(tag: Tag) {
    if (this.isSelected(tag)) {
      this.tagRemoved.emit(tag);
    } else {
      this.tagAdded.emit(tag);
    }
  }

  createTag() {
    const name = this.query().trim();
    if (!name) return;
    this.tagCreated.emit(name);
    this.query.set('');
  }

  dismiss() {
    this.query.set('');
    this.dismissed.emit();
  }
}

