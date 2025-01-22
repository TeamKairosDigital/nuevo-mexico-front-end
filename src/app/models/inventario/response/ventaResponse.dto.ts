import { Deserializable } from "../../interfaces";

export class ventaResponseDto implements Deserializable {

    id: number;
    codigoEmpleado: string;
    nombreEmpleado: string;
    cantidadUnidad: number;
    idProducto: number;
    nombreProducto: string;
    precioSugerido: number;
    montoTotal: number;
    pagoEfectivo: number;
    fechaCracion: string;
    icon?: string;

    constructor() {
        this.id = 0;
        this.codigoEmpleado = '';
        this.nombreEmpleado = '';
        this.cantidadUnidad = 0;
        this.idProducto = 0;
        this.nombreProducto = '';
        this.precioSugerido = 0;
        this.montoTotal = 0;
        this.pagoEfectivo = 0;
        this.fechaCracion = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}