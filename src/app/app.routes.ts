import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path:'',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path:'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path:'cliente',
    loadComponent: () => import('./components/cliente/cliente.component').then(m => m.ClienteComponent)
  },
  {
    path:'crear-servicio',
    loadComponent: () => import('./components/crear-servicio/crear-servicio.component').then(m => m.CrearServicioComponent)
  },
  {
    path:'crear-usuario',
    loadComponent: () => import('./components/crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent)
  },
];
