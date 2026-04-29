// reminder-picker-modal.component.ts
import { Component, computed, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons }              from '@ng-icons/core';
import {
  heroBell, heroXMark, heroTrash, heroCheck,
} from '@ng-icons/heroicons/outline';

export type ReminderUnit = 'minutes' | 'hours';

@Component({
  selector: 'nevernote-reminder-picker-modal',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ heroBell, heroXMark, heroTrash, heroCheck })],
  templateUrl: './reminder-picker-modal.html',
})
export class ReminderPickerModal {

  open        = input.required<boolean>();
  reminderAt  = input<Date | null>(null);

  confirmed = output<Date>();
  removed   = output<void>();
  dismissed = output<void>();

  amount = signal<number>(1);
  unit   = signal<ReminderUnit>('hours');

  previewDate = computed(() => {
    const ms = this.unit() === 'hours'
      ? this.amount() * 60 * 60 * 1000
      : this.amount() * 60 * 1000;
    return new Date(Date.now() + ms);
  });

  previewLabel = computed(() => {
    const d = this.previewDate();
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month:   'short',
      day:     'numeric',
      hour:    '2-digit',
      minute:  '2-digit',
    });
  });

  isValid = computed(() => this.amount() > 0);

  hasExisting = computed(() => this.reminderAt() !== null);

  confirm() {
    if (!this.isValid()) return;
    this.confirmed.emit(this.previewDate());
    this.dismissed.emit();
  }

  remove() {
    this.removed.emit();
    this.dismissed.emit();
  }
}
