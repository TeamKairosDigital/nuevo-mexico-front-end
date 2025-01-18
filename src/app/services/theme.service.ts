import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme!: string;
  private themeChanged = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo accedemos a localStorage y document en el navegador
      this.currentTheme = localStorage.getItem('theme') || 'saga-blue'; // Tema por defecto
      this.applyTheme(this.currentTheme);
    } else {
      this.currentTheme = 'saga-blue'; // Establece un tema por defecto en el servidor
    }
  }

  changeTheme(theme: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) {
        themeLink.href = `https://cdn.jsdelivr.net/npm/primeng/resources/themes/${theme}/theme.css`;
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.themeChanged.next();  // Emitir evento cuando el tema cambia
      } else {
        console.error('Elemento link para el tema no encontrado.');
      }
    }
  }

  private applyTheme(theme: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) {
        themeLink.href = `https://cdn.jsdelivr.net/npm/primeng/resources/themes/${theme}/theme.css`;
      } else {
        console.error('Elemento link para el tema no encontrado.');
      }
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  // Observable para suscribirse a los cambios de tema
  getThemeChangedObservable() {
    return this.themeChanged.asObservable();
  }
}
