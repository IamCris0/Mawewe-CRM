// src/app/components/dashboard/dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Data } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private dataService = inject(Data);
  
  stats = this.dataService.getEstadisticas();
  prospectos = this.dataService.prospectos();
  tareas = this.dataService.tareas();

  getEstadoClass(estado: string): string {
    const clases: any = {
      'nuevo': 'badge-new',
      'contactado': 'badge-contacted',
      'negociacion': 'badge-negotiation',
      'ganado': 'badge-won',
      'perdido': 'badge-lost',
      'pendiente': 'badge-pending',
      'en-progreso': 'badge-progress',
      'completada': 'badge-completed'
    };
    return clases[estado] || '';
  }

  getPrioridadClass(prioridad: string): string {
    const clases: any = {
      'baja': 'priority-low',
      'media': 'priority-medium',
      'alta': 'priority-high'
    };
    return clases[prioridad] || '';
  }
}