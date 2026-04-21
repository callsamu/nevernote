import { PagedResults } from './common';
import { Observable } from 'rxjs';
import { Notebook } from '@app/notebook';


export type NotebookCreateInput = Pick<Notebook, 'name'> & Partial<Pick<Notebook, 'description'>>;

export type NotebookUpdateInput = Partial<
  Pick<Notebook, 'name' | 'description' | 'trashed'>
>;

export type NotebookSortField = 'name' | 'createdAt';

export interface NotebookListOptions {
  sort: NotebookSortField;
  trashed?: boolean;
}


export abstract class NotebookRepository {
  abstract getById(id: string): Observable<Notebook | null>;

  abstract list(
    options?: NotebookListOptions
  ): Observable<PagedResults<Notebook>>;

  abstract create(input: NotebookCreateInput): Observable<Notebook>;

  abstract update(id: string, input: NotebookUpdateInput): Observable<Notebook>;

  abstract remove(id: string): Observable<void>;
}
