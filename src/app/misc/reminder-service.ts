import { Injectable } from '@angular/core';
import { Note }       from '@app/note';
 
@Injectable({ providedIn: 'root' })
export class ReminderService {
 
  private handles = new Map<string, ReturnType<typeof setTimeout>>();
 
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied')  return false;
 
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
 
  async schedule(note: Note): Promise<void> {
    if (!note.reminderAt) return;
 
    const granted = await this.requestPermission();
    if (!granted) {
      console.warn('Notification permission denied — reminder not scheduled');
      return;
    }
 
    // Cancel any existing reminder for this note
    this.cancel(note.id);
 
    const delay = note.reminderAt.getTime() - Date.now();
    if (delay <= 0) return; // already in the past
 
    const handle = setTimeout(() => {
      new Notification(`Reminder: ${note.title || 'Untitled'}`, {
        body: note.content
          ? note.content.replace(/<[^>]*>/g, '').slice(0, 100)
          : 'You have a note reminder.',
        icon: '/icons/icon-192x192.png',
      });
      this.handles.delete(note.id);
    }, delay);
 
    this.handles.set(note.id, handle);
  }
 
  cancel(noteId: string): void {
    const handle = this.handles.get(noteId);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.handles.delete(noteId);
    }
  }
 
  isScheduled(noteId: string): boolean {
    return this.handles.has(noteId);
  }
}
 

