import { inject, Injectable, signal } from '@angular/core';
import { Notebook } from '@app/notebook';
import { NotebookCreateInput, NotebookRepository } from '@app/persistence/notebook-repository';

@Injectable({
  providedIn: 'root',
})
export class NotebookStore {
  repository = inject(NotebookRepository);

  selected = signal<Notebook | null>(null);
  contents = signal<Notebook[]>([]);

  constructor() {
    this.fill();
  }

  private fill() {
    this.repository.list({
      sort: 'createdAt',
    }).subscribe(records => {
      this.contents.set(records.items);
    });
  }

  create(name: string, description?: string) {
    this.repository.create({
      name,
      description,
    }).subscribe(nb => {
      const nbs = this.contents();
      this.contents.set([ nb, ...nbs ]);
    })
  }

  remove(id: string) {
    this.repository.remove(id).subscribe(() => {
      const nbs = this.contents();
      const removed = nbs.filter(nb => nb.id === id);
      this.contents.set(removed);

      if (this.selected()?.id === id) {
        this.selected.set(null);
      }
    })
  }
}
