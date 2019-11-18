import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + 'ventas';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Venta []> {
    return this.http.get<Venta []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Venta []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Venta>(this.url + '/' + id );
  }
  /** Crear registro */
  create( venta: Venta ) {
    return this.http.post<Venta>( this.url, venta);
  }
  /** Actualizar registro */
  update( venta: Venta) {
    return this.http.put<Venta>(this.url, venta );
  }

}
