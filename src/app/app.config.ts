import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NotebookRepository } from './persistence/notebook-repository';
import { IDBNotebookRepository } from './persistence/idb/idb-notebook-repository';
import { NoteRepository } from './persistence/note-repository';
import { IDBNoteRepository } from './persistence/idb/idb-note-repository';
import { TagRepository } from './persistence/tag-repository';
import { IDBTagRepository } from './persistence/idb/idb-tag-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: NoteRepository , useClass: IDBNoteRepository },
    { provide: NotebookRepository, useClass: IDBNotebookRepository },
    { provide: TagRepository, useClass: IDBTagRepository },
  ]
};
