import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Persona } from 'app/models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  /***Definimos la ruta del servicio a consumir */
  url = environment.apiUrl + '/personas';

  constructor( private http: HttpClient) {

  }
  /** Obtener todos los registros */
  getAll(): Observable<Persona []> {
    return this.http.get<Persona []>(this.url + '/findAll');
  }
  /** Obtener todos los registros habilitados */
  getAllEnabled() {
    return this.http.get<Persona []>(this.url + '/enabled');
  }
  /** Obtener registro por id  */
  getById( id: string ) {
    return this.http.get<Persona>(this.url + '/' + id );
  }
  /** Crear registro */
  create( persona: Persona ) {
    return this.http.post<Persona>( this.url, persona);
  }
  /** Actualizar registro */
  update( persona: Persona) {
    return this.http.put<Persona>(this.url, persona );
  }

}
