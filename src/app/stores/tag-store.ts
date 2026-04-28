// tag.store.ts
import { Injectable, signal } from '@angular/core';
import { Tag } from '@app/tag';

@Injectable({
  providedIn: 'root',
})
export class TagStore {
  selected = signal<Tag | null>(null);
  contents = signal<Tag[]>([]);

  setAll(tags: Tag[]) {
    this.contents.set(tags);
  }

  add(tag: Tag) {
    this.contents.update(tags => [tag, ...tags]);
  }

  update(updated: Tag) {
    this.contents.update(tags =>
      tags.map(t => t.id === updated.id ? updated : t)
    );
    if (this.selected()?.id === updated.id) {
      this.selected.set(updated);
    }
  }

  remove(id: string) {
    this.contents.update(tags => tags.filter(t => t.id !== id));
    if (this.selected()?.id === id) {
      this.selected.set(null);
    }
  }
}
