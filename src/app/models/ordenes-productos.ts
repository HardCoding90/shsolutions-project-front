export interface OrdenProducto {
    idOrdenProducto: number;
    idProducto: number;
    idOrden: number;
    idProductoProveedor: number;
    cantidad: number;
    valorCompraUnidad: number;
    marca: string;
    producto: string;
    referencia: string;
    indicadorHabilitado: boolean;
}