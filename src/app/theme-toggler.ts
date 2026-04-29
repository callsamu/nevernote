import { Injectable, signal } from '@angular/core';

enum THEMES {
  DARK = 'forest',
  LIGHT = 'emerald'
}

@Injectable({
  providedIn: 'root',
})
export class ThemeToggler {
  private readonly attribute = 'data-theme';
  private readonly storageKey = 'theme';

  isDark = signal(this.getSaved() === THEMES.DARK);

  constructor() {
    this.apply(this.getSaved());
  }

  toggle() {
    const next = this.isDark() ? THEMES.LIGHT : THEMES.DARK;
    this.apply(next);
    localStorage.setItem(this.storageKey, next);
    this.isDark.set(next === THEMES.DARK);
    console.log(next, this.isDark());
  }

  private getSaved(): string {
    return localStorage.getItem(this.storageKey) ?? THEMES.DARK;
  }

  private apply(theme: string) {
    document.documentElement.setAttribute(this.attribute, theme);
  }
}
