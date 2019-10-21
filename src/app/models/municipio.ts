import { Departamento } from "./departamento";

export interface Municipio {
    idMunicipio: number;
    idDepartamento: number;
    codigo: number;
    ciudad: string;
    departamentos: Departamento ;
    indicadorHabilitado: boolean;
}