import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ServicioService } from '../../services/servicio.service';
import { ReservaService } from '../../services/reserva.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent {
  usuario: any = null;
  servicios: any[] = [];
  reservas: any[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'horaInicio', 'horaFin', 'precio', 'acciones'];

  constructor(
    private servicioService: ServicioService,
    private reservaService: ReservaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarServicios();
    
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.cargarReservas(this.usuario.id);  // Cargar las reservas del usuario al inicio
    }
  }

  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe(
      (data) => {
        this.servicios = data;
        this.actualizarEstadoBotones();  // Actualizar los botones luego de cargar los servicios
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }

  cargarReservas(clienteId: number): void {
    this.reservaService.obtenerReservasPorCliente(clienteId).subscribe(
      (data) => {
        this.reservas = data; // Almacenar las reservas del usuario
        this.actualizarEstadoBotones();  // Actualizar los botones después de cargar las reservas
      },
      (error) => {
        console.error('Error al cargar las reservas del usuario:', error);
      }
    );
  }

  actualizarEstadoBotones(): void {
    // Asociamos cada servicio con el estado de la reserva correspondiente
    this.servicios.forEach(servicio => {
      // Verificar si el usuario tiene una reserva para este servicio
      const reserva = this.reservas.find(res => res.servicio.id === servicio.id);
  
      // Si tiene una reserva
      if (reserva) {
        if (reserva.estado === 'CONFIRMADA') {
          servicio.estadoBoton = 'Cancelar Turno';  // Si está confirmada, el botón será "Cancelar Turno"
        } else if (reserva.estado === 'CANCELADA') {
          servicio.estadoBoton = 'Asignar Turno';  // Si está cancelada, el botón será "Asignar Turno"
        }
      } else {
        // Si no tiene reserva, el botón será "Asignar Turno"
        servicio.estadoBoton = 'Asignar Turno';
      }
    });
  }

  asignarTurno(servicioId: number): void {
    if (!this.usuario) {
      alert('No se ha encontrado un usuario autenticado');
      return;
    }

    // Verificar si el usuario ya tiene una reserva para este servicio
    const reservaExistente = this.reservas.some(reserva => reserva.servicio.id === servicioId);

    if (reservaExistente) {
      // Si ya tiene una reserva y la reserva está CONFIRMADA, cancelamos el turno
      const reserva = this.reservas.find(reserva => reserva.servicio.id === servicioId);
      if (reserva.estado === 'CONFIRMADA') {
        this.cancelarTurno(servicioId);
      }
    } else {
      // Si no tiene una reserva, crear una nueva reserva
      this.crearReserva(servicioId);
    }
  }

  crearReserva(servicioId: number): void {
    const fecha = new Date().toISOString().slice(0, 23);
    const nuevaReserva = {
      usuario: { id: this.usuario.id },
      cliente: { id: this.usuario.id },
      servicio: { id: servicioId },
      fechaReserva: fecha,
      estado: 'CONFIRMADA',
    };

    this.reservaService.crearReserva(nuevaReserva).subscribe({
      next: (reserva) => {
        alert('Turno asignado correctamente');
        this.reservas.push(reserva);  
        this.actualizarEstadoBotones();  // Actualizamos los botones después de asignar turno
      },
      error: (err) => {
        console.error('Error al asignar turno:', err);
        alert('Ocurrió un error al asignar el turno');
      },
    });
  }

  cancelarTurno(servicioId: number): void {
    const fecha = new Date().toISOString().slice(0, 23);
    const nuevaReserva = {
      usuario: { id: this.usuario.id },
      cliente: { id: this.usuario.id },
      servicio: { id: servicioId },
      fechaReserva: fecha,
      estado: 'CANCELADA',
    };

    this.reservaService.crearReserva(nuevaReserva).subscribe({
      next: () => {
        alert('Turno cancelado correctamente');
        // Filtramos la reserva cancelada de la lista
        this.reservas = this.reservas.filter(reserva => reserva.servicio.id !== servicioId);
        // Actualizamos los botones para que cambien a 'Asignar Turno'
        this.actualizarEstadoBotones();  // Actualizar los botones después de cancelar el turno
      },
      error: (err) => {
        console.error('Error al cancelar turno:', err);
        alert('Ocurrió un error al cancelar el turno');
      },
    });
  }

  tieneReserva(servicioId: number): boolean {
    return this.reservas.some(reserva => reserva.servicio.id === servicioId);
  }
}
