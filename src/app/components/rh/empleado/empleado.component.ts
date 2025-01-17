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

  createEmpleadoDto: createEmpleadoDto = {
    id: 0,
    codigo_empleado: '',
    idTipoEmpelado: 0,
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

  toggleIcon(documento: any): void {
    documento.icon = 
      documento.icon === 'pi pi-chevron-right' ? 
      'pi pi-chevron-down' : 
      'pi pi-chevron-right';
  }

  buscar(){
    this.getListEmpleado(this.filterEmpleadoDto);
  }

  openModalProducto(id: number = 0){
    // this.EsNuevo = true;
    this.dialogEmpleado = true;
  }

  hideDialog(name: string) {
    this.dialogEmpleado = false;
    
  }

  createEmpleado(): void {
    this.spinner = true;

    this.createEmpleadoDto.idUsuario = Number(this.storageService.getItem('userId'));
    if (this.createEmpleadoDto.id != 0) {
      this.rhService.updateEmpleado(this.createEmpleadoDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListEmpleado(this.filterEmpleadoDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
      });
    } else {
      this.rhService.createEmpleado(this.createEmpleadoDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListEmpleado(this.filterEmpleadoDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
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

  // Eliminar el producto
  private deleteEmpleado(id: number) {
    this.rhService.deleteEmpleado(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: response.message });
        this.getListEmpleado(this.filterEmpleadoDto);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        console.error('Error deleting document:', response.message);
      }
    });
  }

  // private clear(){

  //   // createInventarioDto
  //   this.createInventarioDto.id = 0;
  //   this.createInventarioDto.codigo = '';
  //   this.createInventarioDto.idClasificacionProducto = 0;
  //   this.createInventarioDto.nombre_producto = '';
  //   this.createInventarioDto.idUnidad = 0;
  //   this.createInventarioDto.inventario_inicial = 0;
  //   this.createInventarioDto.costo_inicial = 0;

  //   // createEntradaInventarioDto
  //   this.createEntradaInventarioDto.id = 0
  //   this.createEntradaInventarioDto.entrada = 0
  //   this.createEntradaInventarioDto.costo = 0
  //   this.createEntradaInventarioDto.id_producto = 0

  // }

}
