import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  setTheme(theme: 'light' | 'dark') {
    document.body.setAttribute('data-theme', theme)
  }
}
