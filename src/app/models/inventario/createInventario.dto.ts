export class createInventarioDto {
    id?: number | null;
    codigo: string = '';
    idClasificacionProducto: number = 0;
    nombre_producto: string = '';
    idUnidad: number = 0;
    inventario_inicial: number = 0;
    costo_inicial: number = 0;
    cantidad_actual?: number | null;
    precio_actual?: number | null;
    idUsuario: number = 0;
}