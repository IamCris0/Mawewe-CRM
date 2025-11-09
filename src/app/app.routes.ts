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
  
  // Dashboard
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]
  },