import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearServicio(servicio: any, adminId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear?adminId=${adminId}`, servicio);
  }
    

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
  
}
