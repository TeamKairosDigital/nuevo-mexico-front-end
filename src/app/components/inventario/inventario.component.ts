import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../tools/imports';
import { SideBarComponent } from '../items/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InventarioService } from '../../services/inventario.service';
import { StorageService } from '../../services/storage.service';
import { filterInventarioDto } from '../../models/inventario/filterInventario.dto';
import { inventarioResponseDto } from '../../models/inventario/response/inventarioResponse.dto';
import { createInventarioDto } from '../../models/inventario/createInventario.dto';
import { itemsResponseDto } from '../../models/inventario/response/itemsResponse.dto';
import { createEntradaInventarioDto } from '../../models/inventario/createEntradaInventario.dto';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class InventarioComponent {

  @ViewChild('configSidebar') configSidebar!: SideBarComponent;

  toggleSidebar(): void {
    this.configSidebar.sidebarVisible = !this.configSidebar.sidebarVisible;
  }

  dialogProduct: boolean = false;
  dialogEntrada: boolean = false;
  spinner: boolean = false;
  EsNuevo: boolean = false;

  // Tabla
  filterInventarioDto: filterInventarioDto = {
    codigo: '',
    idClasificacionProducto: 0,
    idUnidad: 0,
    nombreProducto: ''
  }

  inventarioResponseDto: inventarioResponseDto[] = [];
  first = 0;
  rows = 10;

  expandedRows: { [key: number]: boolean } = {};

  // PRODUCTO
  createInventarioDto: createInventarioDto = {
    id: 0,
    codigo: '',
    idClasificacionProducto: 0,
    nombre_producto: '',
    idUnidad: 0,
    inventario_inicial: 0,
    costo_inicial: 0,
    idUsuario: 0
  }

  // Parametros
  unidadesFiltro: itemsResponseDto[] = [];
  clasificacionFiltro: itemsResponseDto[] = [];


  // ENTRADA DE PRODUCTO
  createEntradaInventarioDto: createEntradaInventarioDto = {
    id: 0,
    entrada: 0,
    costo: 0,
    idUsuario: 0,
    id_producto: 0
  }

  unidades: itemsResponseDto[] = [];
  clasificacion: itemsResponseDto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getClasificacionProductos();
    this.getUnidades();
    this.getListInventario(this.filterInventarioDto);
  }

  // Tabla
  getListInventario(data: filterInventarioDto): void {
    this.spinner = true;
    this.inventarioService.getListInventario(data).subscribe((response) => {
      if (response.success && response.data) {
        this.inventarioResponseDto = response.data;
        this.inventarioResponseDto.forEach((element) => {
          element.icon = 'pi pi-chevron-right';
        });
      }
      this.clear();
      this.collapseAll();
      this.spinner = false;
    });
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // expandAll() {
  //   this.expandedRows = this.inventarioResponseDto.reduce((acc: { [key: number]: boolean }, p) => {
  //     acc[p.id] = true;
  //     return acc;
  //   }, {});
  // }

  collapseAll() {
      this.expandedRows = {};
  }

  toggleIcon(documento: any): void {
    documento.icon = 
      documento.icon === 'pi pi-chevron-right' ? 
      'pi pi-chevron-down' : 
      'pi pi-chevron-right';
  }

  buscar(){
    this.getListInventario(this.filterInventarioDto);
  }

  // PRODUCTO
  // Abrir modal para crear y editar producto
  openModalProducto(id: number = 0){
    // this.EsNuevo = true;
    this.dialogProduct = true;
  }

  createProducto(): void {
    this.spinner = true;

    this.createInventarioDto.idUsuario = Number(this.storageService.getItem('userId'));
    if (this.createInventarioDto.id != 0) {
      this.inventarioService.updateInventario(this.createInventarioDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('Producto');
          this.getListInventario(this.filterInventarioDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
      });
    } else {
      this.inventarioService.createInventario(this.createInventarioDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('Producto');
          this.getListInventario(this.filterInventarioDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
      });
    }

  }

  // Alerta de confirmación para eliminación del producto
  confirmDeleteProducto(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este producto del inventario?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteInventario(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });

  }
  // PRODUCTO


  // ENTRADA DEL PRODUCTO
  openModalEntrada(id: number) {
    // this.selectedFile = null;
    // this.createAvisoPrivacidadArchivoDto.id = 0;
    // this.createAvisoPrivacidadArchivoDto.nombreArchivo = '';
    // this.createAvisoPrivacidadArchivoDto.avisoPrivacidadId = id;
    // this.EsNuevo = true;
    // this.openFileModal('archivo');

    // this.EsNuevo = true;
    this.createEntradaInventarioDto.id_producto = id;
    this.dialogEntrada = true;
  }

  createEntrada(): void {
    this.spinner = true;

    this.createEntradaInventarioDto.idUsuario = Number(this.storageService.getItem('userId'));
    if (this.createEntradaInventarioDto.id != 0) {
      this.inventarioService.updateEntradaInventario(this.createEntradaInventarioDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListInventario(this.filterInventarioDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
      });
    } else {
      this.inventarioService.createEntradaInventario(this.createEntradaInventarioDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListInventario(this.filterInventarioDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message });
        }
        this.spinner = false;
      });
    }

  }

  confirmDeleteEntrada(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este aviso de privacidad?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteEntradaInventario(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }
  // ENTRADA DEL PRODUCTO

  // Cerrar modal
  hideDialog(name: string) {
    if (name == 'Producto') {
      this.dialogProduct = false;
    } else {
      this.dialogEntrada = false;
    }
    
  }

  botonValid(value: string): boolean {

    if (value == 'Producto') {
      if (Number(this.createInventarioDto.idClasificacionProducto) > 0 && this.createInventarioDto.nombre_producto.length > 0 &&
      Number(this.createInventarioDto.idUnidad) > 0 && Number(this.createInventarioDto.inventario_inicial) > 0 && Number(this.createInventarioDto.costo_inicial) > 0
      ) {
        return false;
      }else{
        return true;
      }
    } else {
      if (Number(this.createEntradaInventarioDto.entrada) > 0 && this.createEntradaInventarioDto.entrada != null && 
          Number(this.createEntradaInventarioDto.costo) > 0 && this.createEntradaInventarioDto.costo != null) {
        return false;
      } else {
        return true;
      }
    }

  }

  // Parametros
  private getClasificacionProductos(): void {
    this.inventarioService.getClasificacionProductos().subscribe((response) => {
      if (response.success && response.data) {
        this.clasificacion = response.data;

        // Crear el objeto adicional
        const objetoAdicional: itemsResponseDto = {
          id: 0,
          nombre: 'Todos',
          deserialize: function (input: any): itemsResponseDto {
            throw new Error('Function not implemented.');
          }
        };

        // Guardar los datos en la variable clasificacionFiltro
        this.clasificacionFiltro = [objetoAdicional, ...response.data];
      }
    });
  }

  private getUnidades(): void {
    this.inventarioService.getUnidades().subscribe((response) => {
      if (response.success && response.data) {
        this.unidades = response.data;

        // Crear el objeto adicional
        const objetoAdicional: itemsResponseDto = {
            id: 0,
            nombre: 'Todos',
            deserialize: function (input: any): itemsResponseDto {
              throw new Error('Function not implemented.');
          }
        };

        // Guardar los datos en la variable clasificacionFiltro
        this.unidadesFiltro = [objetoAdicional, ...response.data];
      }
    });
  }

  // Eliminar el producto
  private deleteInventario(id: number) {
    this.inventarioService.deleteInventario(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Aviso de privacidad ha sido eliminado' });
        this.getListInventario(this.filterInventarioDto);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar Aviso de privacidad' });
        console.error('Error deleting document:', response.message);
      }
    });
  }

  // Eliminar entrada del producto
  private deleteEntradaInventario(id: number) {
    this.inventarioService.deleteEntradaInventario(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Aviso de privacidad ha sido eliminado' });
        this.getListInventario(this.filterInventarioDto);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar Aviso de privacidad' });
        console.error('Error deleting document:', response.message);
      }
    });
  }

  private clear(){

    // createInventarioDto
    this.createInventarioDto.id = 0;
    this.createInventarioDto.codigo = '';
    this.createInventarioDto.idClasificacionProducto = 0;
    this.createInventarioDto.nombre_producto = '';
    this.createInventarioDto.idUnidad = 0;
    this.createInventarioDto.inventario_inicial = 0;
    this.createInventarioDto.costo_inicial = 0;

    // createEntradaInventarioDto
    this.createEntradaInventarioDto.id = 0
    this.createEntradaInventarioDto.entrada = 0
    this.createEntradaInventarioDto.costo = 0
    this.createEntradaInventarioDto.id_producto = 0

  }

}
