import { inject, Injectable } from '@angular/core';
import { Note } from '@app/note';
import { NoteRepository } from '@app/persistence/note-repository';
import { map, mergeAll, mergeMap, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteTrasher {
  private repo = inject(NoteRepository);

  trash(id: string): Observable<Note> {
    return this.repo.update(id, { trashed: true });
  }

  restore(id: string): Observable<Note> {
    return this.repo.update(id, { trashed: false });
  }

  delete(id: string): Observable<void> {
    return this.repo.remove(id);
  }

  empty(): Observable<void> {
    return this
      .repo
      .list({ trashed: true, sort: 'updatedAt' })
      .pipe(
        map(records => records.items.map(n => n.id)),
        mergeMap(ids => this.repo.bulkRemove(ids))
      );
  }

}
