import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filterEmpleadoDto } from '../models/empleado/filterEmpleado.dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/response/ApiResponseDto';
import { empleadoResponseDto } from '../models/empleado/response/empleadoResponse.dto';
import { createEmpleadoDto } from '../models/empleado/createEmpleado.dto';
import { itemsResponseDto } from '../models/inventario/response/itemsResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class RhService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/rh`;

  constructor(private http: HttpClient) { }

  // Lista de inventario
  getListEmpleado(parameters: filterEmpleadoDto): Observable<ApiResponse<empleadoResponseDto[]>> {
    return this.http.get<ApiResponse<empleadoResponseDto[]>>(`${this.apiUrl}/getListEmpleado`, {
      params: parameters as any,
    });
  }

  // EMPLEADO
  // Crear empleado para inventario
  createEmpleado(data: createEmpleadoDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createEmpleado`, data);
  }

  // Obtener empleado por ID
  getEmpleadoById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getEmpleadoById/${id}`);
  }

  // Actualizar empleado para inventario
  updateEmpleado(data: createEmpleadoDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateEmpleado`, data);
  }

  // Eliminar empleado para inventario
  deleteEmpleado(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteEmpleado/${id}`);
  }
  // EMPLEADO

  // PARAMETROS
  getTipoEmpleado(): Observable<ApiResponse<itemsResponseDto[]>> {
    return this.http.get<ApiResponse<itemsResponseDto[]>>(`${this.apiUrl}/getTipoEmpleado`);
  }

  getEmpleados(): Observable<ApiResponse<itemsResponseDto[]>> {
    return this.http.get<ApiResponse<itemsResponseDto[]>>(`${this.apiUrl}/getEmpleados`);
  }

}
