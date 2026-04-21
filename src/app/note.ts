//import { Reminder } from "./reminder";

export interface Note {
  id: string;
  version: number;

  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  notebookId: string;
  tagIds: string[];
  pinned: boolean;
  //remainder?: Reminder;

  trashed: boolean;
}
