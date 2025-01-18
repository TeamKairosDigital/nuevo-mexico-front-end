import { Deserializable } from "../../interfaces";

export class empleadoResponseDto implements Deserializable {

    id: number;
    tipoEmpelado: string;
    idTipoEmpelado?: number;
    codigo_empleado: string;
    nombre_Empleado: string;
    telefono: string;
    region_origen: string;
    acompanantes?: number;
    observaciones: string;
    fecha_creacion?: string;
    usuario_creacion?: string;
    fecha_modificacion?: string;
    usuario_modificacion?: string;
    icon?: string;

    constructor() {
        this.id = 0;
        this.codigo_empleado = '';
        this.tipoEmpelado = '';
        this.nombre_Empleado = '';
        this.telefono = '';
        this.region_origen = '';
        this.acompanantes = 0;
        this.observaciones = '';
        this.fecha_creacion = '';
        this.usuario_creacion = '';
        this.fecha_modificacion = '';
        this.usuario_modificacion = '';
        this.icon = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}