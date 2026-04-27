import { Routes } from '@angular/router';
import { App }             from './app';
import { AllNotesShell }   from './components/shells/all-notes/all-notes-shell';
import { NotebookShell }   from './components/shells/notebook/notebook-shell';
import { TrashShell } from './components/shells/trash/trash-shell';
//import { TagShell }        from './components/shells/tag/tag-shell';

export const routes: Routes = [
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
  {
    path: '',
    children: [
      { path: 'notes',              component: AllNotesShell },
      { path: 'notes/:noteId',      component: AllNotesShell },

      { path: 'notebooks/:notebookId',           component: NotebookShell },
      { path: 'notebooks/:notebookId/:noteId',   component: NotebookShell },

      //{ path: 'tags/:tagId',           component: TagShell },
      //{ path: 'tags/:tagId/:noteId',   component: TagShell },

      { path: 'trash',           component: TrashShell },
      { path: 'trash/:noteId',   component: TrashShell },
    ]
  },
];
