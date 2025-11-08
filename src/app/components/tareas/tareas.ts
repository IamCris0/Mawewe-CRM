import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Data, Tarea } from '../../services/data';

@Component({
  selector: 'app-tareas',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas {
  private dataService = inject(Data);
  
  tareas = this.dataService.tareas;
  empleados = this.dataService.empleados;
  searchTerm = signal('');
  filterEstado = signal('todos');
  filterPrioridad = signal('todos');
  filterAsignado = signal('todos');
  showModal = signal(false);
  
  nuevaTarea: Tarea = this.getEmptyTarea();

  estados = ['todos', 'pendiente', 'en-progreso', 'completada'];
  prioridades = ['todos', 'baja', 'media', 'alta'];

  empleadosActivos = computed(() => {
    return this.empleados().filter(e => e.estado === 'activo');
  });

  asignadosDisponibles = computed(() => {
    const nombres = new Set(this.tareas().map(t => t.asignadoA));
    return ['todos', ...Array.from(nombres)];
  });

  tareasFiltradas = computed(() => {
    let filtered = this.tareas();
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(t => 
        t.titulo.toLowerCase().includes(term) ||
        t.descripcion.toLowerCase().includes(term) ||
        t.asignadoA.toLowerCase().includes(term)
      );
    }
    
    if (this.filterEstado() !== 'todos') {
      filtered = filtered.filter(t => t.estado === this.filterEstado());
    }
    
    if (this.filterPrioridad() !== 'todos') {
      filtered = filtered.filter(t => t.prioridad === this.filterPrioridad());
    }
    
    if (this.filterAsignado() !== 'todos') {
      filtered = filtered.filter(t => t.asignadoA === this.filterAsignado());
    }
    
    return filtered;
  });

  getTotalTareas() {
    return this.tareas().length;
  }

  getTareasPorEstado(estado: string) {
    return this.tareas().filter(t => t.estado === estado).length;
  }

  getTareasVencidas() {
    const hoy = new Date();
    return this.tareas().filter(t => 
      new Date(t.fechaVencimiento) < hoy && t.estado !== 'completada'
    ).length;
  }

  getEmptyTarea(): Tarea {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      id: Date.now(),
      titulo: '',
      descripcion: '',
      asignadoA: this.empleadosActivos().length > 0 ? this.empleadosActivos()[0].nombre : '',
      prioridad: 'media',
      estado: 'pendiente',
      fechaVencimiento: tomorrow
    };
  }

  openModal() {
    this.nuevaTarea = this.getEmptyTarea();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  guardarTarea() {
    if (this.nuevaTarea.titulo && this.nuevaTarea.asignadoA) {
      this.tareas.update(current => [...current, this.nuevaTarea]);
      this.closeModal();
    }
  }

  eliminarTarea(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.tareas.update(current => current.filter(t => t.id !== id));
    }
  }

  cambiarEstado(id: number, nuevoEstado: 'pendiente' | 'en-progreso' | 'completada') {
    this.tareas.update(current => 
      current.map(t => 
        t.id === id ? { ...t, estado: nuevoEstado } : t
      )
    );
  }

  getEstadoClass(estado: string): string {
    const clases: any = {
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

  estaVencida(fecha: Date): boolean {
    return new Date(fecha) < new Date() && this.tareas().find(t => t.fechaVencimiento === fecha)?.estado !== 'completada';
  }
}