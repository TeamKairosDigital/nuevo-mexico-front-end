import { Deserializable } from "../../interfaces";

export class itemsResponseDto implements Deserializable {

    id: number;
    nombre: string;

    constructor() {
        this.id = 0;
        this.nombre = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}