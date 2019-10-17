import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';
import { Departamento } from 'app/models/departamento';
import { Pais } from 'app/models/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/paises';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Pais []> {
    return this.http.get<Pais []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Pais []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Pais>(this.url + '/' + id );
  }
  /** Crear registro */
  create( pais: Pais ) {
    return this.http.post<Pais>( this.url, pais);
  }
  /** Actualizar registro */
  update( pais: Pais) {
    return this.http.put<Venta>(this.url, pais );
  }

}
