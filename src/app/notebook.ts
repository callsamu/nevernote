export interface Notebook {
  id: string;
  name: string;
  description?: string;
  trashed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
