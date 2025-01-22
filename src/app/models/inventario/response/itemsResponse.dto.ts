import { Deserializable } from "../../interfaces";

export class itemsResponseDto implements Deserializable {

    id: number;
    nombre: string;
    codigo?: string;
    cantidad_actual?: number;
    precio_actual?: number; 

    constructor() {
        this.id = 0;
        this.nombre = '';
        this.codigo = '';
        this.cantidad_actual = 0;
        this.precio_actual = 0;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}