export class createVentaDto {
    id?: number;
    empleado_id?: number;
    idUsuario: number = 0;
    listaProductos: listaProductos[] = [];
}

export class listaProductos {
    producto_id: number = 0;
    nombreProducto: string = '';
    cantidad: number = 0;
    montoTotal: number = 0;
    pagoEfectivo: number = 0;
}