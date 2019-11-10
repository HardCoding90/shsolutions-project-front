import { Departamento } from "./departamento";

export interface Municipio {
    idMunicipio: number;
    idDepartamento: number;
    codigo: number;
    municipio: string;
    departamentos: Departamento ;
    indicadorHabilitado: boolean;
}