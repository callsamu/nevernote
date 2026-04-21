import { inject, Injectable, signal } from '@angular/core';
import { TagCreateInput, TagRepository } from '@app/persistence/tag-repository';
import { Tag } from '@app/tag';

@Injectable({
  providedIn: 'root',
})
export class TagStore {
  repository = inject(TagRepository);

  selected = signal<Tag | null>(null);
  contents = signal<Tag[]>([]);

  constructor() {
    this.fill();
  }

  private fill() {
    this.repository.list({ sort: 'name' }).subscribe(records => {
      this.contents.set(records.items);
    });
  }

  create(name: string, color?: string) {
    this.repository.create({ name, color }).subscribe(tag => {
      this.contents.update(tags => [tag, ...tags]);
    });
  }

  update(id: string, input: Partial<TagCreateInput>) {
    this.repository.update(id, input).subscribe(updated => {
      this.contents.update(tags =>
        tags.map(t => t.id === id ? updated : t)
      );
      if (this.selected()?.id === id) {
        this.selected.set(updated);
      }
    });
  }

  remove(id: string) {
    this.repository.remove(id).subscribe(() => {
      this.contents.update(tags => tags.filter(t => t.id !== id));
      if (this.selected()?.id === id) {
        this.selected.set(null);
      }
    });
  }
}

