import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
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
  
  // Dashboard - CON guard
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]
  },
  
  // Prospectos - CON guard
  { 
    path: 'prospectos', 
    component: Prospectos,
    canActivate: [authGuard]
  },
  
  // Clientes - CON guard
  { 
    path: 'clientes', 
    component: Clientes,
    canActivate: [authGuard]
  },
  
  // Empleados - CON guard
  { 
    path: 'empleados', 
    component: Empleados,
    canActivate: [authGuard]
  },
  
  // Tareas - CON guard
  { 
    path: 'tareas', 
    component: Tareas,
    canActivate: [authGuard]
  },
  
  // Cualquier otra ruta redirige a login
  { path: '**', redirectTo: '/login' }
];