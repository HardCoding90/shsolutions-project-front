import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';
import { Municipio } from 'app/models/municipio';
import { Proveedor } from 'app/models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/proveedores';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Proveedor  []> {
    return this.http.get<Proveedor []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Proveedor []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Proveedor>(this.url + '/' + id );
  }
  /** Crear registro */
  create( proveedor: Proveedor ) {
    return this.http.post<Proveedor>( this.url, proveedor);
  }
  /** Actualizar registro */
  update( proveedor: Proveedor) {
    return this.http.put<Proveedor>(this.url, proveedor );
  }

}
