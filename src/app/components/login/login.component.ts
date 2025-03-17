import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MaterialModule, FormsModule,CommonModule] 
})
export class LoginComponent {
  email: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log("Intentando iniciar sesión con:", this.email, this.contrasena);
    
    this.authService.login(this.email, this.contrasena).subscribe(
      (usuario) => {
        console.log("Respuesta de la API:", usuario);
  
        if (usuario) {
          localStorage.setItem('usuario', JSON.stringify(usuario)); // Guarda el usuario completo
          localStorage.setItem('adminId', usuario.id.toString()); // Guarda solo el ID
  
          console.log("✅ ID guardado en localStorage:", usuario.id); // Verifica el ID
  
          if (usuario.tipoUsuario === 'ADMIN') {
            console.log("Redirigiendo a /admin...");
            this.router.navigate(['/admin']); 
          } else {
            console.log("Redirigiendo a /cliente...");
            this.router.navigate(['/cliente']);
          }
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos';
          console.log("Usuario no encontrado");
        }
      },
      (error) => {
        this.errorMessage = 'Error en la conexión con el servidor';
        console.error("Error en la petición:", error);
      }
    );
  }
  
}
