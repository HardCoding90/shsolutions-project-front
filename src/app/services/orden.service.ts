import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';
import { Municipio } from 'app/models/municipio';
import { Proveedor } from 'app/models/proveedor';
import { Orden } from 'app/models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/ordenes';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Orden []> {
    return this.http.get<Orden []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Orden []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: number ) {
    return this.http.get<Orden>(this.url + '/findById/' + id );
  }
  /** Crear registro */
  create( orden: Orden ) {
    return this.http.post<Orden>( this.url, orden);
  }
  /** Actualizar registro */
  update( orden: Orden) {
    return this.http.put<Orden>(this.url, orden );
  }
  

}
