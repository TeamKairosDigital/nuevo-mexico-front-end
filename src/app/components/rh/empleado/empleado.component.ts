import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../tools/imports';
import { SideBarComponent } from '../../items/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RhService } from '../../../services/rh.service';
import { StorageService } from '../../../services/storage.service';
import { itemsResponseDto } from '../../../models/inventario/response/itemsResponse.dto';
import { filterEmpleadoDto } from '../../../models/empleado/filterEmpleado.dto';
import { empleadoResponseDto } from '../../../models/empleado/response/empleadoResponse.dto';
import { createEmpleadoDto } from '../../../models/empleado/createEmpleado.dto';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.scss',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class EmpleadoComponent {

  @ViewChild('configSidebar') configSidebar!: SideBarComponent;

  toggleSidebar(): void {
    this.configSidebar.sidebarVisible = !this.configSidebar.sidebarVisible;
  }

  dialogEmpleado: boolean = false;
  spinner: boolean = false;
  EsNuevo: boolean = false;

  expandedRows: { [key: number]: boolean } = {};

  // Tabla
  filterEmpleadoDto: filterEmpleadoDto = {
    idTipoEmpleado: 0,
    nombreEmpleado: ''
  }

  empleadoResponseDto: empleadoResponseDto[] = [];
  first = 0;
  rows = 10;

  // Parametros
  tiposEmpleado: itemsResponseDto[] = [];
  tiposEmpleadoFiltro: itemsResponseDto[] = [];

  empleadoResponseById: empleadoResponseDto = {
    id: 0,
    tipoEmpelado: '',
    idTipoEmpelado: 0,
    codigo_empleado: '',
    nombre_Empleado: '',
    telefono: '',
    region_origen: '',
    acompanantes: 0,
    observaciones: '',
    
    deserialize: function (input: any): empleadoResponseDto {
      throw new Error('Function not implemented.');
    }
  }

  createEmpleadoDto: createEmpleadoDto = {
    id: 0,
    codigo_empleado: '',
    idTipoEmpleado: 0,
    nombre_Empleado: '',
    telefono: '',
    region_origen: '',
    acompanantes: 0,
    observaciones: '',
    idUsuario: 0
  }

  constructor(
    private rhService: RhService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getTipoEmpleado();
    this.getListEmpleado(this.filterEmpleadoDto);
  }

  // Tabla
  getListEmpleado(data: filterEmpleadoDto): void {
    this.spinner = true;
    this.rhService.getListEmpleado(data).subscribe((response) => {
      if (response.success && response.data) {
        this.empleadoResponseDto = response.data;
        this.empleadoResponseDto.forEach((element) => {
          element.icon = 'pi pi-chevron-right';
        });
      }
      // this.clear();
      this.collapseAll();
      this.spinner = false;
    });
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  toggleIcon(documento: any): void {
    documento.icon = 
      documento.icon === 'pi pi-chevron-right' ? 
      'pi pi-chevron-down' : 
      'pi pi-chevron-right';
  }

  buscar(){
    this.getListEmpleado(this.filterEmpleadoDto);
  }

  openModalEmpleado(id: number = 0){
    // this.EsNuevo = true;
    this.clear();
    if(id != 0){
      this.createEmpleadoDto.id = id;
      this.getEmpleadoById(id);
    }
    this.dialogEmpleado = true;
  }

  hideDialog(name: string) {
    this.dialogEmpleado = false;
    
  }

  createEmpleado(): void {
    this.spinner = true;

    this.createEmpleadoDto.idUsuario = Number(this.storageService.getItem('userId'));
    if (this.createEmpleadoDto.id != 0) {
      this.rhService.updateEmpleado(this.createEmpleadoDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog('');
            this.getListEmpleado(this.filterEmpleadoDto);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message, life: 10000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
          }
          this.spinner = false; // Detén el spinner en ambos casos
        },
        error: (error) => {
          // Maneja el error del backend y muestra un mensaje
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al crear el empleado',
            life: 10000
          });
          this.spinner = false; // Detén el spinner en caso de error
        },
      });
    } else {
      this.rhService.createEmpleado(this.createEmpleadoDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog('');
            this.getListEmpleado(this.filterEmpleadoDto);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message, life: 10000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
          }
          this.spinner = false; // Detén el spinner en ambos casos
        },
        error: (error) => {
          // Maneja el error del backend y muestra un mensaje
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al crear el empleado',
            life: 10000
          });
          this.spinner = false; // Detén el spinner en caso de error
        },
      });
    }

  }

  // Alerta de confirmación para eliminación del Empleado
  confirmDeleteEmpleado(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este empleado?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteEmpleado(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });

  }

  botonValid(value: string): boolean {

    if (this.createEmpleadoDto.codigo_empleado.length > 0 &&  Number(this.createEmpleadoDto.idTipoEmpleado) > 0 && this.createEmpleadoDto.nombre_Empleado.length > 0  && 
        this.createEmpleadoDto.telefono.toString().length == 10 && this.createEmpleadoDto.region_origen.length > 0 &&  this.createEmpleadoDto.observaciones.length > 0) 
    {
      return false;
    } else {
      return true;
    }

  }

  // Permitir solo números al presionar teclas
  validateNumber(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (
      !/[0-9]/.test(event.key) && // Permitir solo números
      !allowedKeys.includes(event.key) // Permitir teclas adicionales como borrar, tab, flechas
    ) {
      event.preventDefault();
    }
  }

  // Limitar el valor a un máximo de 10 dígitos
  limitToTenDigits(): void {
    if (this.createEmpleadoDto.telefono.length > 10) {
      this.createEmpleadoDto.telefono = this.createEmpleadoDto.telefono.slice(0, 10);
    }
  }

  private collapseAll() {
    this.expandedRows = {};
  }

  private getTipoEmpleado(): void {
    this.rhService.getTipoEmpleado().subscribe((response) => {
      if (response.success && response.data) {
        this.tiposEmpleado = response.data;

        // Crear el objeto adicional
        const objetoAdicional: itemsResponseDto = {
          id: 0,
          nombre: 'Todos',
          deserialize: function (input: any): itemsResponseDto {
            throw new Error('Function not implemented.');
          }
        };

        // Guardar los datos en la variable clasificacionFiltro
        this.tiposEmpleadoFiltro = [objetoAdicional, ...response.data];
      }
    });
  }

  private getEmpleadoById(id: number){
    
    this.spinner = true;
    this.rhService.getEmpleadoById(id).subscribe((response) => {
      if (response.success && response.data) {
        this.createEmpleadoDto = response.data;
        // this.createEmpleadoDto.id = this.empleadoResponseById.id;

      }
      this.spinner = false;
    });
  }

  // Eliminar el Empleado
  private deleteEmpleado(id: number) {
    this.spinner = true;
    this.rhService.deleteEmpleado(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: response.message });
        this.getListEmpleado(this.filterEmpleadoDto);
        this.clear();
        this.spinner = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        console.error('Error deleting document:', response.message);
        this.spinner = false;
      }

    });
  }

  private clear(){

    // createEmpleadoDto
    this.createEmpleadoDto.id = 0;
    this.createEmpleadoDto.codigo_empleado = '';
    this.createEmpleadoDto.idTipoEmpleado = 0;
    this.createEmpleadoDto.nombre_Empleado = '';
    this.createEmpleadoDto.telefono = '';
    this.createEmpleadoDto.region_origen = '';
    this.createEmpleadoDto.acompanantes = 0;
    this.createEmpleadoDto.observaciones = '';

  }

}
