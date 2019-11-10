import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from 'app/models/producto';
import { HttpClient } from '@angular/common/http';
import { Venta } from 'app/models/venta';
import { Departamento } from 'app/models/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/departamentos';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Departamento []> {
    return this.http.get<Departamento []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Departamento []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Departamento>(this.url + '/' + id );
  }
  /** Crear registro */
  create( departamento: Departamento ) {
    return this.http.post<Departamento>( this.url, departamento);
  }
  /** Actualizar registro */
  update( departamento: Departamento) {
    return this.http.put<Departamento>(this.url, departamento );
  }

    /** Obtener todos los registros por país */
    getByPais( idPais: number ): Observable<Departamento []> {
      return this.http.get<Departamento []>(this.url + '/pais/' + idPais);
    }

}
