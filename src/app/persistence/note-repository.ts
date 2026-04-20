import { Observable } from "rxjs";
import { Note } from "@app/note";
import { PagedResults } from "./common";

type NoteSortField = 'title' | 'updatedAt' | 'createdAt';

export type NoteCreateInput = Pick<Note, 'title' | 'content' | 'notebookId'>
export type NoteUpdateInput = NoteCreateInput & Partial<Pick<Note, 'tagIds'>>

export interface NoteListOptions {
  notebookId?: string;
  tagIds?: string[];
  trashed?: boolean;
  sort: NoteSortField;
}

export abstract class NoteRepository {
  abstract getById(id: string): Observable<Note | null>;

  abstract list(options?: NoteListOptions): Observable<PagedResults<Note>>;

  abstract create(input: NoteCreateInput): Observable<Note>;

  abstract update(id: string, input: NoteUpdateInput): Observable<Note>;

  abstract remove(id: string): Observable<void>;

  // abstract move(noteId: string, targetNotebookId: string): Observable<Note>;

  // abstract addTags(noteId: string, tagIds: string[]): Observable<Note>;

  // abstract removeTags(noteId: string, tagIds: string[]): Observable<Note>;
}

