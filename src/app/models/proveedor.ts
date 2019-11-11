export interface Proveedor {
    idProveedor: number;
    email: string;
    fechaRegistro: string;
    nit: string,
    razonSocial: string;
    barrio: string;
    celular: string;
    telefono: string;
    direccion: string;
    indicadorCliente: boolean;
    indicadorHabilitado: boolean;
}