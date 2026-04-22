import { Observable } from "rxjs";
import { PagedResults } from "./common";
import { Note } from "@app/note";

export interface NoteSearchOptions {
  keyword: string;
}

export abstract class SearchRepository {
  abstract searchNotes(options: NoteSearchOptions): Observable<PagedResults<Note>>;
}
