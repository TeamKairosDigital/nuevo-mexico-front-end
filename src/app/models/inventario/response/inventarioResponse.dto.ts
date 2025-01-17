import { Deserializable } from "../../interfaces";

export class inventarioResponseDto implements Deserializable {

    id: number;
    codigo: string;
    clasificacionProducto: string;
    nombre_producto: string;
    unidad: string;
    inventario_inicial: number;
    costo_inicial: number;
    cantidad_actual: number;
    precio_actual: number;
    entradaInventariado: entradaInventariadoResponseDto[];
    icon?: string;
    fecha: string;

    constructor() {
        this.id = 0;
        this.codigo = '';
        this.clasificacionProducto = '';
        this.nombre_producto = '';
        this.unidad = '';
        this.inventario_inicial = 0;
        this.costo_inicial = 0;
        this.cantidad_actual = 0;
        this.precio_actual = 0;
        this.entradaInventariado = [];
        this.icon = '';
        this.fecha = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}

export class entradaInventariadoResponseDto {
    
    id: number;
    entrada: number;
    costo: number;

    constructor() {
        this.id = 0;
        this.entrada = 0;
        this.costo = 0;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}