import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  private themeModeSubject = new BehaviorSubject<ThemeMode>('auto');
  public themeMode$: Observable<ThemeMode> = this.themeModeSubject.asObservable();

  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.loadTheme();
    this.setupSystemThemeListener();
  }

  private loadTheme(): void {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const mode: ThemeMode = savedMode || 'auto';

    this.themeModeSubject.next(mode);
    this.applyTheme(mode);
  }

  private setupSystemThemeListener(): void {
    // Écoute les changements de préférence système en temps réel
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.themeModeSubject.value === 'auto') {
        this.setDarkMode(e.matches);
      }
    });
  }

  private applyTheme(mode: ThemeMode): void {
    const prefersDark = this.mediaQuery.matches;

    let isDark: boolean;
    switch (mode) {
      case 'dark':
        isDark = true;
        break;
      case 'light':
        isDark = false;
        break;
      case 'auto':
      default:
        isDark = prefersDark;
        break;
    }

    this.setDarkMode(isDark);
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeModeSubject.next(mode);
    localStorage.setItem('themeMode', mode);
    this.applyTheme(mode);
  }

  toggleDarkMode(): void {
    const currentMode = this.themeModeSubject.value;

    // Cycle: auto -> light -> dark -> auto
    let newMode: ThemeMode;
    switch (currentMode) {
      case 'auto':
        newMode = 'light';
        break;
      case 'light':
        newMode = 'dark';
        break;
      case 'dark':
        newMode = 'auto';
        break;
      default:
        newMode = 'auto';
    }

    this.setThemeMode(newMode);
  }

  private setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  getThemeMode(): ThemeMode {
    return this.themeModeSubject.value;
  }
}
