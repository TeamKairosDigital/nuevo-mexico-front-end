import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filterInventarioDto } from '../models/inventario/filterInventario.dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/response/ApiResponseDto';
import { inventarioResponseDto } from '../models/inventario/response/inventarioResponse.dto';
import { createInventarioDto } from '../models/inventario/createInventario.dto';
import { createEntradaInventarioDto } from '../models/inventario/createEntradaInventario.dto';
import { itemsResponseDto } from '../models/inventario/response/itemsResponse.dto';
import { filterVentaDto } from '../models/inventario/filterVenta.dto';
import { ventaResponseDto } from '../models/inventario/response/ventaResponse.dto';
import { createVentaDto } from '../models/inventario/createVenta.dto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/inventario`;

  constructor(private http: HttpClient) { }

  // Lista de inventario
  getListInventario(parameters: filterInventarioDto): Observable<ApiResponse<inventarioResponseDto[]>> {
    return this.http.get<ApiResponse<inventarioResponseDto[]>>(`${this.apiUrl}/getListInventario`, {
      params: parameters as any,
    });
  }

  // Producto para inventario
  // Crear producto para inventario
  createInventario(data: createInventarioDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createInventario`, data);
  }

  // Obtener producto por ID
  getInventarioById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getInventarioById/${id}`);
  }

  // Actualizar producto para inventario
  updateInventario(data: createInventarioDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateInventario`, data);
  }

  // Eliminar producto para inventario
  deleteInventario(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteInventario/${id}`);
  }
  // Producto para inventario

  // Entrada producto
  // Crear entrada producto
  createEntradaInventario(data: createEntradaInventarioDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createEntradaInventario`, data);
  }

  // Obtener entrada por ID
  getEntradaInventarioById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getEntradaInventarioById/${id}`);
  }

  // Actualizar entrada producto
  updateEntradaInventario(data: createEntradaInventarioDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateEntradaInventario`, data);
  }

  // Eliminar entrada producto
  deleteEntradaInventario(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteEntradaInventario/${id}`);
  }

  getUnidades(): Observable<ApiResponse<itemsResponseDto[]>> {
    return this.http.get<ApiResponse<itemsResponseDto[]>>(`${this.apiUrl}/getUnidades`);
  }

  getClasificacionProductos(): Observable<ApiResponse<itemsResponseDto[]>> {
    return this.http.get<ApiResponse<itemsResponseDto[]>>(`${this.apiUrl}/getClasificacionProductos`);
  }

  // Lista de Ventas
  getListVentas(parameters: filterVentaDto): Observable<ApiResponse<ventaResponseDto[]>> {
    return this.http.get<ApiResponse<ventaResponseDto[]>>(`${this.apiUrl}/getListVentas`, {
      params: parameters as any,
    });
  }

  // Crear venta
  createVenta(data: createVentaDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createVenta`, data);
  }

  // Obtener lista de productos de inventario
  getInventario(): Observable<ApiResponse<itemsResponseDto[]>> {
    return this.http.get<ApiResponse<itemsResponseDto[]>>(`${this.apiUrl}/getInventario`);
  }


}
