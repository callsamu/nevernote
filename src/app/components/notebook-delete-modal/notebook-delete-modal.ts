import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle, heroTrash } from '@ng-icons/heroicons/outline';
import { Notebook } from '@app/notebook';

@Component({
  selector: 'nevernote-notebook-delete-modal',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ heroExclamationTriangle, heroTrash })],
  templateUrl: './notebook-delete-modal.html',
})
export class NotebookDeleteModal {
  notebook = input<Notebook | null>(null);

  confirmed = output<Notebook>();
  dismissed = output<void>();

  confirm() {
    const nb = this.notebook();
    if (nb) this.confirmed.emit(nb);
  }
}
