export interface Notebook {
  id: string;
  version: number;
  name: string;
  description?: string;
  trashed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
