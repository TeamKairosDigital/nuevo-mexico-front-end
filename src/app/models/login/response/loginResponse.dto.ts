import { Deserializable } from "../../interfaces";

export class LoginResponseDto implements Deserializable {
    id: number;
    username: string;
    nombre: string;
    rol: string;
    access_token: string;

    constructor() {
        this.id = 0;
        this.username = '';
        this.nombre = '';
        this.rol = '';
        this.access_token = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}