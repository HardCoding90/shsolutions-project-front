export interface Factura {
    fechaFactura: Date;
    idFactura: number;
    idIva: number;
    idVenta: number;
    indicadorHabilitado: boolean;
    indicadorPagada: boolean;
}