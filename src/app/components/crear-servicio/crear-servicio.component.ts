import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { ServicioService } from '../../services/servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-servicio',
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './crear-servicio.component.html',
  styleUrl: './crear-servicio.component.css'
})
export class CrearServicioComponent {
  servicioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    public router: Router
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      precio: ['', Validators.required],
      duracion: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  guardarServicio() {
    const adminIdString = localStorage.getItem('adminId');
    const adminId = adminIdString ? Number(adminIdString) : null;
  
    console.log("🟡 Admin ID antes de enviar:", adminId); // Verifica el ID
  
    if (!adminId || adminId === 0) {
      console.error("❌ Error: No hay un admin ID válido en localStorage");
      return;
    }
  
    const servicio = {
      nombre: this.servicioForm.value.nombre,
      descripcion: this.servicioForm.value.descripcion,
      horaInicio: this.servicioForm.value.horaInicio,
      horaFin: this.servicioForm.value.horaFin,
      precio: this.servicioForm.value.precio,
      duracion: this.servicioForm.value.duracion,
      estado: "Activo"
    };
  
    this.servicioService.crearServicio(servicio, adminId).subscribe({
      next: (data) => console.log('✅ Servicio creado:', data),
      error: (error) => console.error('❌ Error al crear el servicio', error)
    });
  }
  
  
  

  goToListado() {
    this.router.navigate(['/listado-servicios']); // Reemplaza con la ruta correcta
  }
}
