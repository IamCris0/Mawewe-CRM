import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Prospectos } from './components/prospectos/prospectos';
import { Clientes } from './components/clientes/clientes';
import { Empleados } from './components/empleados/empleados';
import { Tareas } from './components/tareas/tareas';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Ruta por defecto redirige a login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login - sin guard
  { path: 'login', component: Login },
  
  
  // Prospectos
  { 
    path: 'prospectos', 
    component: Prospectos,
    canActivate: [authGuard]
  },
  
  // Clientes
  { 
    path: 'clientes', 
    component: Clientes,
    canActivate: [authGuard]
  },
  
  // Empleados
  { 
    path: 'empleados', 
    component: Empleados,
    canActivate: [authGuard]
  },
  
  // Tareas
  { 
    path: 'tareas', 
    component: Tareas,
    canActivate: [authGuard]
  },
  
  // Cualquier otra ruta redirige a login
  { path: '**', redirectTo: '/login' }
];