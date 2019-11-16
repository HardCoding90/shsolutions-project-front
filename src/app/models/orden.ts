import { OrdenProducto } from "./ordenes-productos";

export interface Orden {
    idOrden: number;
    idSucursal: number;
    fechaOrden: Date;
    indicadorRecibida: boolean;
    ordenesProductos: OrdenProducto [];
    indicadorCliente: boolean;
    indicadorHabilitado: boolean;
}