import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Data } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private dataService = inject(Data);
  
  stats = this.dataService.getEstadisticas();
  prospectos = this.dataService.prospectos();
  tareas = this.dataService.tareas();
  
  showExportMenu = signal(false);

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

  // Funciones de exportación
  exportToJSON(): void {
    const data = this.dataService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mawewe-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.showExportMenu.set(false);
  }

  exportToCSV(): void {
    // Exportar prospectos a CSV
    const prospectos = this.dataService.prospectos();
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Estado', 'Fecha Creación'];
    const rows = prospectos.map(p => [
      p.id,
      p.nombre,
      p.email,
      p.telefono,
      p.empresa,
      p.estado,
      new Date(p.fechaCreacion).toLocaleDateString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mawewe-prospectos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.showExportMenu.set(false);
  }

  importData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const success = this.dataService.importData(event.target.result);
          if (success) {
            alert('✅ Datos importados exitosamente');
            // Recargar stats
            this.stats = this.dataService.getEstadisticas();
            this.prospectos = this.dataService.prospectos();
            this.tareas = this.dataService.tareas();
          } else {
            alert('❌ Error al importar datos');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    this.showExportMenu.set(false);
  }

  resetData(): void {
    this.dataService.resetToDefaults();
    this.stats = this.dataService.getEstadisticas();
    this.prospectos = this.dataService.prospectos();
    this.tareas = this.dataService.tareas();
    this.showExportMenu.set(false);
  }

  toggleExportMenu(): void {
    this.showExportMenu.set(!this.showExportMenu());
  }

  getProspectosDistribution() {
    const prospectos = this.dataService.prospectos();
    return {
      nuevo: prospectos.filter(p => p.estado === 'nuevo').length,
      contactado: prospectos.filter(p => p.estado === 'contactado').length,
      negociacion: prospectos.filter(p => p.estado === 'negociacion').length,
      ganado: prospectos.filter(p => p.estado === 'ganado').length,
      perdido: prospectos.filter(p => p.estado === 'perdido').length,
    };
  }

  getTareasDistribution() {
    const tareas = this.dataService.tareas();
    return {
      pendiente: tareas.filter(t => t.estado === 'pendiente').length,
      enProgreso: tareas.filter(t => t.estado === 'en-progreso').length,
      completada: tareas.filter(t => t.estado === 'completada').length,
    };
  }
}