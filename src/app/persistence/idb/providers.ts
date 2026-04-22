import { NoteRepository } from "../note-repository";
import { NotebookRepository } from "../notebook-repository";
import { SearchRepository } from "../search-repository";
import { TagRepository } from "../tag-repository";
import { IDBNoteRepository } from "./idb-note-repository";
import { IDBNotebookRepository } from "./idb-notebook-repository";
import { IDBSearchRepository } from "./idb-search-repository";
import { IDBTagRepository } from "./idb-tag-repository";

export function provideIDB() {
  return [
    IDBSearchRepository,
    { provide: SearchRepository, useClass: IDBSearchRepository },
    { provide: NoteRepository , useClass: IDBNoteRepository },
    { provide: NotebookRepository, useClass: IDBNotebookRepository },
    { provide: TagRepository, useClass: IDBTagRepository },
  ]
}
