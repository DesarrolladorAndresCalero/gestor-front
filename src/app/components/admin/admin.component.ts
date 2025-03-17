import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio.service';
import { ReservaService } from '../../services/reserva.service';  // Asegúrate de importar el servicio correcto
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule,MaterialModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  usuario: any = null;
  usuarios: any[] = []; 
  servicios: any[] = [];
  reservas: any[] = []; // Aquí guardarás las reservas

  displayedColumns: string[] = ['nombre', 'descripcion', 'horaInicio', 'horaFin', 'precio', 'duracion', 'estado', 'acciones'];
  displayedColumnsUsuarios: string[] = ['nombre', 'email', 'rol', 'acciones'];

  constructor(
    private servicioService: ServicioService,
    private reservaService: ReservaService,  // Servicio de reservas
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarUsuarios();

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.cargarReservas(this.usuario.id);  // Llamar al método cargarReservas con el id del usuario
    }
  }

  // Método para cargar los servicios
  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe(
      (data) => {
        this.servicios = data;
        console.log('Servicios cargados:', this.servicios);
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }

  // Método para cargar las reservas por usuario
  cargarReservas(usuarioId: number): void {
    this.reservaService.obtenerReservasPorUsuario(usuarioId).subscribe(
      (data) => {
        this.reservas = data;
        console.log('Reservas cargadas:', this.reservas);
        this.actualizarEstadosDeServicios();  // Llamamos a actualizar los estados después de cargar las reservas
      },
      (error) => {
        console.error('Error al obtener reservas:', error);
      }
    );
  }

  // Método para actualizar el estado de los servicios
  actualizarEstadosDeServicios(): void {
    // Comparar cada servicio con las reservas
    this.servicios.forEach(servicio => {
      // Filtramos las reservas para obtener la última reserva del servicio
      const reservasServicio = this.reservas.filter(reserva => reserva.servicio.id === servicio.id);
      if (reservasServicio.length > 0) {
        // Encontramos la última reserva por fecha
        const ultimaReserva = reservasServicio.sort((a, b) => new Date(b.fechaReserva).getTime() - new Date(a.fechaReserva).getTime())[0];
        // Actualizamos el estado del servicio
        servicio.estado = ultimaReserva.estado;
      } else {
        // Si no hay reservas, podemos poner un estado por defecto (por ejemplo, 'PENDIENTE')
        servicio.estado = 'PENDIENTE';
      }
    });
  }

  // Eliminar servicio
  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          alert('Servicio eliminado correctamente');
          this.cargarServicios();
        },
        error: (err) => {
          console.error('Error al eliminar servicio:', err);
          alert('Ocurrió un error al eliminar el servicio');
        }
      });
    }
  }

  // Eliminar usuario
  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente');
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Ocurrió un error al eliminar el usuario');
        }
      });
    }
  }

  // Cargar lista de usuarios
  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  abrirFormulario(): void {
    this.router.navigate(['/crear-servicio']);
  }

  abrirFormularioUsuario(): void {
    this.router.navigate(['/crear-usuario']);
  }
}
