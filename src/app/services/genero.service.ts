import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Genero } from 'app/models/genero';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + 'generos';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Genero []> {
    return this.http.get<Genero []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Genero []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Genero>(this.url + '/' + id );
  }
  /** Crear registro */
  create( genero: Genero ) {
    return this.http.post<Genero>( this.url, genero);
  }
  /** Actualizar registro */
  update( genero: Genero) {
    return this.http.put<Genero>(this.url, genero );
  }

}
