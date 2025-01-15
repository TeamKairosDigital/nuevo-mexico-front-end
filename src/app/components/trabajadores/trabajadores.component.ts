import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../tools/imports';
import { SideBarComponent } from '../items/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.scss',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class TrabajadoresComponent {

  @ViewChild('configSidebar') configSidebar!: SideBarComponent;

  toggleSidebar(): void {
    this.configSidebar.sidebarVisible = !this.configSidebar.sidebarVisible;
  }

}
