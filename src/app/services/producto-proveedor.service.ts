import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { ProductoProveedor } from 'app/models/producto-proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProductoProveedorService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl +  '/productosProveedores';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<ProductoProveedor []> {
    return this.http.get<ProductoProveedor []>(this.url);
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<ProductoProveedor []>(this.url + '/findAll/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<ProductoProveedor>(this.url + '/findById/' + id );
  }
  /** Crear registro */
  create( productoProveedor: ProductoProveedor ) {
    return this.http.post<ProductoProveedor>( this.url, productoProveedor);
  }
  /** Actualizar registro */
  update( productoProveedor: ProductoProveedor) {
    return this.http.put<ProductoProveedor>(this.url, productoProveedor );
  }
    /** Obtener por proveedor */
    getByProveedor( idProveedor: number): Observable<ProductoProveedor []> {
      return this.http.get<ProductoProveedor []>(this.url + '/proveedor/' + idProveedor);
    }
  /** Crear registro */
  bulk( productosProveedor: ProductoProveedor [] ) {
    return this.http.post<ProductoProveedor [] >( this.url + '/saveAll', productosProveedor);
  }
}
