import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Persona } from '../model/Persona';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private persona: Persona = new Persona();

  dataSource = new MatTableDataSource<Persona>();

  private baseUrl = 'http://localhost:8001/personas';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/obtenerTodos`);
  }

  obtenerPorId(perId: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/obtenerPorId/${perId}`);
  }

  obtenerPorNombreYTipoDoc(perNombre: string, perTipoDocumento: string): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/obtenerPorNombreYTipoDoc?perNombre=${perNombre}&perTipoDocumento=${perTipoDocumento}`);
  }

  crear(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.baseUrl}/crear`, persona);
  }

  editar(perId: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.baseUrl}/editar?perId=${perId}`, persona);
  }

  eliminar(perId: number): Observable<number> {
    return this.http.delete<number>(`${this.baseUrl}/eliminar?perId=${perId}`);
  }

  getPersona(): Persona{
    return this.persona;
  }

  setPersona(persona: Persona){
    this.persona = persona;
  }

}
