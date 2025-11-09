// src/app/components/tareas/tareas.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  asignadoA: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  fechaCreacion: Date;
  fechaVencimiento: Date;
  categoria: string;
  relacionadoCon: string;
  notas: string;
}

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout],
  templateUrl: './tareas.html',
  styleUrls: ['./tareas.css']
})
export class Tareas implements OnInit {
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  
  searchTerm: string = '';
  filtroPrioridad: string = 'todas';
  filtroEstado: string = 'todas';
  
  showModal: boolean = false;
  isEditing: boolean = false;
  
  tareaForm: Tarea = this.getEmptyTarea();

  stats = {
    total: 0,
    pendientes: 0,
    enProgreso: 0,
    completadas: 0
  };

  categorias = ['Ventas', 'Seguimiento', 'Reunión', 'Documentación', 'Llamada', 'Email', 'Otro'];
  empleados = ['Carlos Mendoza', 'Ana Torres', 'Luis Ramírez', 'María González', 'Pedro Vásquez'];

  ngOnInit() {
    this.cargarTareas();
    this.calcularEstadisticas();
  }

  cargarTareas() {
    this.tareas = [
      {
        id: 1,
        titulo: 'Llamar a prospecto Juan Pérez',
        descripcion: 'Seguimiento de propuesta comercial enviada la semana pasada',
        asignadoA: 'Carlos Mendoza',
        prioridad: 'alta',
        estado: 'pendiente',
        fechaCreacion: new Date('2024-11-07'),
        fechaVencimiento: new Date('2024-11-09'),
        categoria: 'Llamada',
        relacionadoCon: 'Prospecto: Juan Pérez',
        notas: 'Interesado en paquete premium'
      },
      {
        id: 2,
        titulo: 'Enviar cotización a Comercial López',
        descripcion: 'Preparar y enviar cotización detallada para servicios solicitados',
        asignadoA: 'Ana Torres',
        prioridad: 'alta',
        estado: 'en_progreso',
        fechaCreacion: new Date('2024-11-08'),
        fechaVencimiento: new Date('2024-11-10'),
        categoria: 'Ventas',
        relacionadoCon: 'Cliente: Comercial López',
        notas: 'Incluir descuento del 10%'
      },
      {
        id: 3,
        titulo: 'Reunión de equipo semanal',
        descripcion: 'Revisión de objetivos y metas de la semana',
        asignadoA: 'María González',
        prioridad: 'media',
        estado: 'pendiente',
        fechaCreacion: new Date('2024-11-05'),
        fechaVencimiento: new Date('2024-11-09'),
        categoria: 'Reunión',
        relacionadoCon: 'Equipo de ventas',
        notas: 'Preparar reporte de resultados'
      },
      {
        id: 4,
        titulo: 'Actualizar base de datos de clientes',
        descripcion: 'Verificar y actualizar información de contacto de clientes',
        asignadoA: 'Luis Ramírez',
        prioridad: 'baja',
        estado: 'completada',
        fechaCreacion: new Date('2024-11-01'),
        fechaVencimiento: new Date('2024-11-05'),
        categoria: 'Documentación',
        relacionadoCon: 'Sistema CRM',
        notas: 'Completado exitosamente'
      },
      {
        id: 5,
        titulo: 'Seguimiento cliente Distribuidora XYZ',
        descripcion: 'Verificar satisfacción con última compra',
        asignadoA: 'Pedro Vásquez',
        prioridad: 'media',
        estado: 'en_progreso',
        fechaCreacion: new Date('2024-11-08'),
        fechaVencimiento: new Date('2024-11-11'),
        categoria: 'Seguimiento',
        relacionadoCon: 'Cliente: Distribuidora XYZ',
        notas: 'Cliente solicita capacitación'
      }
    ];
    
    this.tareasFiltradas = [...this.tareas];
  }

  calcularEstadisticas() {
    this.stats.total = this.tareas.length;
    this.stats.pendientes = this.tareas.filter(t => t.estado === 'pendiente').length;
    this.stats.enProgreso = this.tareas.filter(t => t.estado === 'en_progreso').length;
    this.stats.completadas = this.tareas.filter(t => t.estado === 'completada').length;
  }

  filtrarTareas() {
    this.tareasFiltradas = this.tareas.filter(tarea => {
      const matchSearch = tarea.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          tarea.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          tarea.asignadoA.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchPrioridad = this.filtroPrioridad === 'todas' || tarea.prioridad === this.filtroPrioridad;
      const matchEstado = this.filtroEstado === 'todas' || tarea.estado === this.filtroEstado;
      
      return matchSearch && matchPrioridad && matchEstado;
    });
  }

  getEmptyTarea(): Tarea {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      asignadoA: '',
      prioridad: 'media',
      estado: 'pendiente',
      fechaCreacion: new Date(),
      fechaVencimiento: new Date(),
      categoria: 'Otro',
      relacionadoCon: '',
      notas: ''
    };
  }

  abrirModal(tarea?: Tarea) {
    this.showModal = true;
    if (tarea) {
      this.isEditing = true;
      this.tareaForm = { ...tarea };
    } else {
      this.isEditing = false;
      this.tareaForm = this.getEmptyTarea();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.tareaForm = this.getEmptyTarea();
  }

  guardarTarea() {
    if (this.isEditing) {
      const index = this.tareas.findIndex(t => t.id === this.tareaForm.id);
      if (index !== -1) {
        this.tareas[index] = { ...this.tareaForm };
      }
    } else {
      this.tareaForm.id = Math.max(...this.tareas.map(t => t.id), 0) + 1;
      this.tareas.push({ ...this.tareaForm });
    }
    
    this.calcularEstadisticas();
    this.filtrarTareas();
    this.cerrarModal();
  }

  eliminarTarea(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.tareas = this.tareas.filter(t => t.id !== id);
      this.calcularEstadisticas();
      this.filtrarTareas();
    }
  }

  cambiarEstado(tarea: Tarea, nuevoEstado: string) {
    const index = this.tareas.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      this.tareas[index].estado = nuevoEstado as any;
      this.calcularEstadisticas();
      this.filtrarTareas();
    }
  }

  getPrioridadColor(prioridad: string): string {
    const colores: any = {
      'alta': '#ef4444',
      'media': '#f59e0b',
      'baja': '#3b82f6'
    };
    return colores[prioridad] || '#6b7280';
  }

  getEstadoColor(estado: string): string {
    const colores: any = {
      'pendiente': '#94a3b8',
      'en_progreso': '#f59e0b',
      'completada': '#10b981',
      'cancelada': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  estaVencida(fecha: Date): boolean {
    return new Date(fecha) < new Date() && this.tareaForm.estado !== 'completada';
  }
}