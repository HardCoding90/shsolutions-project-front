import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrdenProducto } from 'app/models/ordenes-productos';
@Injectable({
  providedIn: 'root'
})
export class OrdeService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/ordenesProductos';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<OrdenProducto []> {
    return this.http.get<OrdenProducto []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<OrdenProducto []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: number ) {
    return this.http.get<OrdenProducto>(this.url + '/findById/' + id );
  }
  /** Crear registro */
  create( ordenProducto: OrdenProducto ) {
    return this.http.post<OrdenProducto>( this.url, ordenProducto);
  }
  /** Actualizar registro */
  update( ordenProducto: OrdenProducto) {
    return this.http.put<OrdenProducto>(this.url, ordenProducto );
  }

}
