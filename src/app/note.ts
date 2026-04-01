import { Reminder } from "./reminder";

export interface Note {
  id: number;
  version: number;

  title: string;
  content: string;
  createDate: Date;
  modifyDate: Date;

  notebook?: string;
  tags?: string[];
  pinned: boolean;
  remainder?: Reminder;

  isTrashed: boolean;
}
