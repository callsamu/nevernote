export interface Tag {
  id: string;
  version: number;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  trashed: boolean;
}
