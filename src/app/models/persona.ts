export interface Persona {
    idPersona: number,
    email: string;
    fechaNacimiento: string;
    fechaRegistro: Date;
    idGenero: number;
    idTipoDocumento: number;
    indicadorAdministrativo: boolean;
    numeroDocumento: string;
    primerApellido: string;
    primerNombre: string;
    segundoApellido: string;
    segundoNombre: string;
    indicadorHabilitado: boolean;
}