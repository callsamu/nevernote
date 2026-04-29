// note-search.component.ts
import {
  Component, computed, inject, input, output, signal, OnInit, OnDestroy,
  APP_INITIALIZER
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass, heroXMark, heroDocumentText,
  heroBookOpen, heroTrash, heroArrowRight,
} from '@ng-icons/heroicons/outline';
import { Note }          from '@app/note';
import { NoteStore }     from '@app/stores/note-store';
import { NotebookStore } from '@app/stores/notebook-store';
import { SafeHTMLPipe }  from '@app/pipes/safe-html-pipe';
import { DatePipe }      from '@angular/common';
import { SearchRepository } from '@app/persistence/search-repository';
import { NotebookRepository } from '@app/persistence/notebook-repository';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, distinctUntilChanged, interval, map, mergeMap, switchMap, tap } from 'rxjs';

export interface SearchResultItem {
  note:       Note;
  context:    'notebook' | 'trash' | 'none';
  notebookId: string | null;
  label:      string;
}

@Component({
  selector: 'nevernote-note-search',
  standalone: true,
  imports: [NgIconComponent, SafeHTMLPipe, DatePipe],
  viewProviders: [provideIcons({
    heroMagnifyingGlass, heroXMark, heroDocumentText,
    heroBookOpen, heroTrash, heroArrowRight,
  })],
  templateUrl: './note-search.html',
})
export class NoteSearch implements OnInit, OnDestroy {

  private search = inject(SearchRepository);
  private notebookStore = inject(NotebookStore);

  // ── Outputs ───────────────────────────────────────────────────────────────
  resultSelected = output<SearchResultItem>();
  dismissed      = output<void>();

  // ── Local state ───────────────────────────────────────────────────────────
  query = signal('');
  private commitedQuery = signal('');

  results$ = toObservable(this.query).pipe(
    debounce(() => interval(200)),
    distinctUntilChanged(),
    tap(q => this.commitedQuery.set(q)),
    switchMap(q => this.search.searchNotes({ keyword: q })),
    map(records => records.items.map(note => {
      if (note.trashed) {
        return { note, context: 'trash' as const, notebookId: null, label: 'Trash' };
      }
      if (note.notebookId) {
        const nb = this.notebookStore.contents().find(n => n.id === note.notebookId);

        return {
          note,
          context:    'notebook' as const,
          notebookId: note.notebookId,
          label:      nb?.name ?? 'Notebook',
        };
      }
      return { note, context: 'none' as const, notebookId: null, label: 'All Notes' };
    }))
  );

  results = toSignal(this.results$, { initialValue: [] });

  hasQuery  = computed(() => this.commitedQuery().trim().length > 0);
  hasResults = computed(() => this.results().length > 0);

  test = computed(() => console.log(this.results()));

  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.dismiss();
  };


  ngOnInit()    { window.addEventListener('keydown', this.keyHandler); }
  ngOnDestroy() { window.removeEventListener('keydown', this.keyHandler); }

  select(item: SearchResultItem) {
    this.query.set('');
    this.resultSelected.emit(item);
  }

  dismiss() {
    this.query.set('');
    this.dismissed.emit();
  }

  contextIcon(item: SearchResultItem): string {
    if (item.context === 'trash')    return 'heroTrash';
    if (item.context === 'notebook') return 'heroBookOpen';
    return 'heroDocumentText';
  }
}
