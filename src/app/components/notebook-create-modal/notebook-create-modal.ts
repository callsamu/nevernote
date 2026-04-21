// notebook-create-modal.component.ts
import { Component, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons }     from '@ng-icons/core';
import { heroBookOpen, heroPlus }            from '@ng-icons/heroicons/outline';

export interface NotebookCreateEvent {
  name: string;
  description?: string;
}

@Component({
  selector: 'nevernote-notebook-create-modal',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ heroBookOpen, heroPlus })],
  templateUrl: './notebook-create-modal.html',
  })
export class NotebookCreateModal {
  open = input.required<boolean>();

  confirmed = output<NotebookCreateEvent>();
  dismissed = output<void>();

  name = signal('');
  description = signal('');

  submit() {
    if (!this.name().trim()) return;

    this.confirmed.emit({
      name: this.name().trim(),
      description: this.description().trim() || undefined,
    });

    this.reset();
  }

  dismiss() {
    this.dismissed.emit();
    this.reset();
  }

  private reset() {
    this.name.set('');
    this.description.set('');
  }
}
