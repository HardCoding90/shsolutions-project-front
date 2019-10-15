import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl +  'productos';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Producto []> {
    return this.http.get<Producto []>(this.url);
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Producto []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Producto>(this.url + '/' + id );
  }
  /** Crear registro */
  create( producto: Producto ) {
    return this.http.post<Producto>( this.url, producto);
  }
  /** Actualizar registro */
  update( producto: Producto) {
    return this.http.put<Producto>(this.url, producto );
  }

}
