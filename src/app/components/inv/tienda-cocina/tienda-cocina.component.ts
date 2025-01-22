import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../tools/imports';
import { SideBarComponent } from '../../items/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filterVentaDto } from '../../../models/inventario/filterVenta.dto';
import { ventaResponseDto } from '../../../models/inventario/response/ventaResponse.dto';
import { createVentaDto } from '../../../models/inventario/createVenta.dto';
import { itemsResponseDto } from '../../../models/inventario/response/itemsResponse.dto';
import { InventarioService } from '../../../services/inventario.service';
import { StorageService } from '../../../services/storage.service';
import { RhService } from '../../../services/rh.service';

@Component({
  selector: 'app-tienda-cocina',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './tienda-cocina.component.html',
  styleUrl: './tienda-cocina.component.scss',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class TiendaCocinaComponent {

  @ViewChild('configSidebar') configSidebar!: SideBarComponent;

  toggleSidebar(): void {
    this.configSidebar.sidebarVisible = !this.configSidebar.sidebarVisible;
  }

  dialogVenta: boolean = false;
  spinner: boolean = false;
  EsNuevo: boolean = false;

  cantidad: number | null = null;
  pagoEfectivo: number | null = null;

  productoSeleccionado: itemsResponseDto = {
    id: 0,
    nombre: '',
    cantidad_actual: 0,
    codigo: '',
    precio_actual: 0,
    deserialize: function (input: any): itemsResponseDto {
      throw new Error('Function not implemented.');
    }
  };
  
  // Tabla
  filterVentaDto: filterVentaDto = {
    idEmpleado: 0,
    idProducto: 0,
    fechaInicio: '',
    FechaFin: ''
  }

  ventaResponseDto: ventaResponseDto[] = [];
  first = 0;
  rows = 10;

  expandedRows: { [key: number]: boolean } = {};

  // Crear venta
  createVentaDto: createVentaDto = {
    id: 0,
    empleado_id: 0,
    idUsuario: 0,
    listaProductos: []
  }

  empleados: itemsResponseDto[] = [];
  productos: itemsResponseDto[] = [];

  empleadosFiltro: itemsResponseDto[] = [];
  productosFiltro: itemsResponseDto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private rhService: RhService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService
  ) { }
  
  ngOnInit() {
    this.getEmpleados();
    this.getInventario();
    // this.getListVentas(this.filterVentaDto);
  }

  // Tabla
  getListVentas(data: filterVentaDto): void {
    this.spinner = true;
    this.inventarioService.getListVentas(data).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.ventaResponseDto = response.data;
          this.ventaResponseDto.forEach((element) => {
            element.icon = 'pi pi-chevron-right';
          });
        }
        this.collapseAll();
        this.spinner = false;
      },
      error: (error) => {
        // Maneja el error del backend y muestra un mensaje
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al crear el empleado',
          life: 10000
        });
        this.collapseAll();
        this.spinner = false;
      },
    });

  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

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
    this.getListVentas(this.filterVentaDto);
  }

  openModalVenta(id: number = 0){
    this.clear();
    this.dialogVenta = true;
  }

  createVenta(): void {
    this.spinner = true;

    this.createVentaDto.idUsuario = Number(this.storageService.getItem('userId'));
    this.inventarioService.createVenta(this.createVentaDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListVentas(this.filterVentaDto);
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

  onProductoSeleccionado(event: any): void {
    const idSeleccionado = event.value;
    this.productoSeleccionado = this.productos.find(
      (producto) => producto.id === idSeleccionado
      ) || {
        id: 0,
        nombre: '',
        cantidad_actual: 0,
        codigo: '',
        precio_actual: 0,
        deserialize: function (input: any): itemsResponseDto {
          throw new Error('Function not implemented.');
        }
    };

    // Reiniciar los valores al seleccionar un nuevo producto
    this.cantidad = null;
    this.pagoEfectivo = null;

    console.log(this.productoSeleccionado);
  }

  agregarProducto(): void {
    if (this.productoSeleccionado && this.cantidad && this.pagoEfectivo) {
      const producto = {
        producto_id: this.productoSeleccionado.id,
        nombreProducto: this.productoSeleccionado.nombre,
        cantidad: this.cantidad,
        montoTotal: (this.productoSeleccionado?.precio_actual ?? 0) * (this.cantidad ?? 0),
        pagoEfectivo: this.pagoEfectivo
      };

      this.createVentaDto.listaProductos.push(producto);
      this.quitarProductoLista(producto.producto_id);

      // Limpiar campos después de agregar el producto
      this.productoSeleccionado = {
        id: 0,
        nombre: '',
        cantidad_actual: 0,
        codigo: '',
        precio_actual: 0,
        deserialize: function (input: any): itemsResponseDto {
          throw new Error('Function not implemented.');
        }
      };
      this.cantidad = null;
      this.pagoEfectivo = null;

      console.log('Producto agregado:', producto);
      console.log('Lista actual:', this.createVentaDto.listaProductos);
    }
  }

  // Cerrar modal
  hideDialog(name: string) {
    this.dialogVenta = false;
  }

  botonValid(value: string): boolean {

    // if (value == 'Producto') {
    //   if (Number(this.createInventarioDto.idClasificacionProducto) > 0 && this.createInventarioDto.nombre_producto.length > 0 &&
    //   Number(this.createInventarioDto.idUnidad) > 0 && Number(this.createInventarioDto.inventario_inicial) > 0 && Number(this.createInventarioDto.costo_inicial) > 0
    //   ) {
    //     return false;
    //   }else{
    //     return true;
    //   }
    // } else {
    //   if (Number(this.createEntradaInventarioDto.entrada) > 0 && this.createEntradaInventarioDto.entrada != null && 
    //       Number(this.createEntradaInventarioDto.costo) > 0 && this.createEntradaInventarioDto.costo != null) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

    return true;

  }

  // Parametros
  private getInventario(): void {
    this.inventarioService.getInventario().subscribe((response) => {
      if (response.success && response.data) {
        this.productos = response.data;

        // Crear el objeto adicional
        const objetoAdicional: itemsResponseDto = {
            id: 0,
            nombre: 'Todos',
            deserialize: function (input: any): itemsResponseDto {
              throw new Error('Function not implemented.');
          }
        };

        // Guardar los datos en la variable clasificacionFiltro
        this.productosFiltro = [objetoAdicional, ...response.data];
      }
    });
  }

  private getEmpleados(): void {
    this.rhService.getEmpleados().subscribe((response) => {
      if (response.success && response.data) {
        this.empleados = response.data;

        // Crear el objeto adicional
        const objetoAdicional: itemsResponseDto = {
            id: 0,
            nombre: 'Todos',
            deserialize: function (input: any): itemsResponseDto {
              throw new Error('Function not implemented.');
          }
        };

        // Guardar los datos en la variable clasificacionFiltro
        this.empleadosFiltro = [objetoAdicional, ...response.data];
      }
    });
  }

  // Eliminar el producto
  private deleteInventario(id: number) {
    // Buscar el índice del producto por ID
    const index = this.createVentaDto.listaProductos.findIndex(
      (p) => p.producto_id === id
    );

    // Si el producto existe, eliminarlo
    if (index !== -1) {
      this.createVentaDto.listaProductos.splice(index, 1);
      // console.log(`Producto con ID ${id} eliminado.`);
      // console.log('Lista actual:', this.createVentaDto.listaProductos);
    } else {
      console.warn(`Producto con ID ${id} no encontrado.`);
    }
  }

  private quitarProductoLista(id: number){
    const index = this.productos.findIndex(
      (p) => p.id === id
    );

    // Si el producto existe, eliminarlo
    if (index !== -1) {
      this.productos.splice(index, 1);
      // console.log(`Producto con ID ${id} eliminado.`);
      // console.log('Lista actual:', this.productos);
    } else {
      console.warn(`Producto con ID ${id} no encontrado.`);
    }
  }



  private clear(){

    // createVentaDto
    this.createVentaDto.id = 0;
    this.createVentaDto.empleado_id = 0;
    this.createVentaDto.listaProductos = [];

  }

}
