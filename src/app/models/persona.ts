export interface Persona {
    idPersona: number,
    idRol: number,
    idSucursal: number,
    email: string;
    fechaNacimiento: string;
    fechaRegistro: Date;
    genero: string;
    indicadorCliente: boolean;
    numeroDocumento: string;
    primerApellido: string;
    primerNombre: string;
    segundoApellido: string;
    segundoNombre: string;
    telefono: string;
    celular: string;
    indicadorHabilitado: boolean;
}