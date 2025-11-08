import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Prospectos } from './components/prospectos/prospectos';
import { Clientes } from './components/clientes/clientes';
import { Empleados } from './components/empleados/empleados';
import { Tareas } from './components/tareas/tareas';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]
  },
  { 
    path: 'prospectos', 
    component: Prospectos,
    canActivate: [authGuard]
  },
  { 
    path: 'clientes', 
    component: Clientes,
    canActivate: [authGuard]
  },
  { 
    path: 'empleados', 
    component: Empleados,
    canActivate: [authGuard]
  },
  { 
    path: 'tareas', 
    component: Tareas,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];