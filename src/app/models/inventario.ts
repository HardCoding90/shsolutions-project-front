export interface Inventario {
    idInventario: number;
    idSucursal: number;
    idProductoProveedor: number;
    cantidadExistente: number;
    producto: string;
    valor: number;
    indicadorHabilitado: boolean;
}
