import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from 'app/models/sucursal';
import {Inventario} from '../models/Inventario';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/sucursales';
  urlInventarios = environment.apiUrl + '/inventarios';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Sucursal []> {
    return this.http.get<Sucursal []>(this.url + '/findAll');
  }

  getAllInventario(): Observable<Inventario []> {
    return this.http.get<Inventario []>(this.urlInventarios + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Sucursal []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Sucursal>(this.url + '/' + id );
  }
  /** Crear registro */
  create( sucursal: Sucursal ) {
    return this.http.post<Sucursal>( this.url, sucursal);
  }
  /** Actualizar registro */
  update( sucursal: Sucursal) {
    return this.http.put<Sucursal>(this.url, sucursal );
  }

}
