import { inject, Injectable } from '@angular/core';
import { NoteRepository } from '@app/persistence/note-repository';
import { NoteStore } from '@app/stores/note-store';

@Injectable({ providedIn: 'root' })
export class NoteTrasher {
  repo = inject(NoteRepository);
  store = inject(NoteStore);

  trash(id: string) {
    this.repo.update(id, { trashed: true });
    this.store.removeFromStore(id);
  }

  restore(id: string) {
    this.repo.update(id, { trashed: false });
    this.store.removeFromStore(id);
  }

  listTrashed() {
    return this.store.list({ trashed: true, sort: 'updatedAt' });
  }
}
