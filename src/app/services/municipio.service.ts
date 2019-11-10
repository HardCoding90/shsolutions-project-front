import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';
import { Municipio } from 'app/models/municipio';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/municipios';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Municipio []> {
    return this.http.get<Municipio []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Municipio []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Municipio>(this.url + '/' + id );
  }
  /** Crear registro */
  create( municipio: Municipio ) {
    return this.http.post<Municipio>( this.url, municipio);
  }
  /** Actualizar registro */
  update( municipio: Municipio) {
    return this.http.put<Municipio>(this.url, municipio );
  }
    /** Obtener por idDepartamento */
    getByDepartamento( idDepartamento: number ): Observable<Municipio []> {
      return this.http.get<Municipio []>(this.url + '/departamento/' + idDepartamento);
    }

}
