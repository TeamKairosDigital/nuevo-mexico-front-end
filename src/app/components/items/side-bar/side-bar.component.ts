import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { ThemeService } from '../../../services/theme.service';
import { ConfirmationService } from 'primeng/api';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { ImportsModule } from '../../../tools/imports';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  providers: [ConfirmationService]
})
export class SideBarComponent {

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  checked: boolean = false;
  sidebarVisible: boolean = false;

  name: string = '';
  rol: string = '';

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    // Cargar el estado del tema desde el localStorage al iniciar el componente
    const savedTheme = localStorage.getItem('theme');

    // Si está guardado en localStorage y es el tema oscuro, marcar el switch como activo
    if (savedTheme === 'arya-blue') {
      this.checked = true;
    } else {
      this.checked = false;
    }

    this.name = this.storageService.getItem('nombre') || '';
    this.rol = this.storageService.getItem('rol') || '';
    // const storedUser = this.storageService.getItem<UserLS>('user');
    // if (storedUser) {
    //   this.user = storedUser;
    // }
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  // Cambiar el tema cuando el switch cambia de estado
  onThemeChange(event: any) {
    if (this.checked) {
      this.themeService.changeTheme('arya-blue'); // Tema oscuro
    } else {
      this.themeService.changeTheme('saga-blue'); // Tema claro
    }
  }

  logout() {
    this.confirmationService.confirm({
      message: '¿Quieres cerrar sesión?',
      header: 'Cerrar sesión',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.removeStorage();
      }
    });

  }

  removeStorage() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
