import { Observable } from 'rxjs';
import { PagedResults } from './common';
import { Tag } from '@app/tag';

export interface TagCreateInput {
  name: string;
  color?: string;
}

export interface TagUpdateInput {
  name?: string;
  color?: string;
}

export type TagSortField = 'name' | 'createdAt';

export interface TagListOptions {
  trashed?: boolean;
  sort?: TagSortField;
}

export abstract class TagRepository {
  abstract getById(id: string): Observable<Tag | null>;
  abstract list(opts: TagListOptions): Observable<PagedResults<Tag>>;
  abstract create(input: TagCreateInput): Observable<Tag>;
  abstract update(id: string, input: TagUpdateInput): Observable<Tag>;

  // delete tag and remove it from every note which references it
  abstract remove(id: string): Observable<void>;
}
