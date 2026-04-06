import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  messages = signal<ToastMessage[]>([]);
  private uid = 0;

  success(message: string) {
    this.add(message, 'success');
  }

  error(message: string) {
    this.add(message, 'error');
  }

  info(message: string) {
    this.add(message, 'info');
  }

  remove(id: number) {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }

  private add(message: string, type: 'success' | 'error' | 'info') {
    const id = ++this.uid;
    this.messages.update(msgs => [...msgs, { id, message, type }]);
    setTimeout(() => this.remove(id), 5000);
  }
}
