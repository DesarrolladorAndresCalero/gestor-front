import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios/login'; // Ruta del backend

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string): Observable<any> {
    console.log("Enviando petición a la API...");
    
    return this.http.post<any>('http://localhost:8080/api/usuarios/login', { email, contrasena });
  }
  

  logout() {
    localStorage.removeItem('usuario'); // Elimina usuario del almacenamiento local
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}
