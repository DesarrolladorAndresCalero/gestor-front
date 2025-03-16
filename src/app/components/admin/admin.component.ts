import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ServicioService } from '../../services/servicio.service';


@Component({
  selector: 'app-admin',
  imports: [CommonModule,MaterialModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  usuario: any = null;
  servicios: any[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'horaInicio', 'horaFin', 'precio', 'duracion', 'estado', 'acciones'];
  
  constructor(private servicioService: ServicioService) {}

  ngOnInit() {
    this.cargarServicios();
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }
  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe(
      (data) => {
        this.servicios = data;
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }

  abrirFormulario(): void {
    console.log('Abrir formulario para añadir un nuevo servicio');
    // Aquí puedes abrir un diálogo o navegar a otro componente para crear un servicio
  }
  
}