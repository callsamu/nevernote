export interface PagedResults<T> {
  items: T[];
};

export function generateId() {
  return crypto.randomUUID();
}
