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
  formErrors: { [key: string]: string } = {};

  stats = {
    total: 0,
    pendientes: 0,
    enProgreso: 0,
    completadas: 0
  };

  categorias = ['Ventas', 'Seguimiento', 'Reunión', 'Documentación', 'Llamada', 'Email', 'Soporte', 'Administrativo'];
  empleados = ['Carlos Mendoza', 'Ana Torres', 'Luis Ramírez', 'María González', 'Pedro Vásquez'];

  ngOnInit() {
    this.cargarTareas();
    this.calcularEstadisticas();
  }

  cargarTareas() {
    const stored = localStorage.getItem('tareas');
    if (stored) {
      this.tareas = JSON.parse(stored).map((t: any) => ({
        ...t,
        fechaCreacion: new Date(t.fechaCreacion),
        fechaVencimiento: new Date(t.fechaVencimiento)
      }));
    } else {
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
        }
      ];
      this.guardarEnStorage();
    }
    
    this.tareasFiltradas = [...this.tareas];
  }

  guardarEnStorage() {
    localStorage.setItem('tareas', JSON.stringify(this.tareas));
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

  validarFormulario(): boolean {
    this.formErrors = {};
    let valido = true;

    if (!this.tareaForm.titulo.trim()) {
      this.formErrors['titulo'] = 'El título es requerido';
      valido = false;
    }

    if (!this.tareaForm.descripcion.trim()) {
      this.formErrors['descripcion'] = 'La descripción es requerida';
      valido = false;
    }

    if (!this.tareaForm.asignadoA) {
      this.formErrors['asignadoA'] = 'Debe asignar la tarea a alguien';
      valido = false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVenc = new Date(this.tareaForm.fechaVencimiento);
    fechaVenc.setHours(0, 0, 0, 0);

    if (fechaVenc < hoy && !this.isEditing) {
      this.formErrors['fechaVencimiento'] = 'La fecha de vencimiento no puede ser anterior a hoy';
      valido = false;
    }

    return valido;
  }

  abrirModal(tarea?: Tarea) {
    this.showModal = true;
    this.formErrors = {};
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
    this.formErrors = {};
  }

  guardarTarea() {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.isEditing) {
      const index = this.tareas.findIndex(t => t.id === this.tareaForm.id);
      if (index !== -1) {
        this.tareas[index] = { ...this.tareaForm };
      }
    } else {
      this.tareaForm.id = Math.max(...this.tareas.map(t => t.id), 0) + 1;
      this.tareaForm.fechaCreacion = new Date();
      this.tareas.unshift({ ...this.tareaForm });
    }
    
    this.guardarEnStorage();
    this.calcularEstadisticas();
    this.filtrarTareas();
    this.cerrarModal();
  }

  eliminarTarea(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.tareas = this.tareas.filter(t => t.id !== id);
      this.guardarEnStorage();
      this.calcularEstadisticas();
      this.filtrarTareas();
    }
  }

  cambiarEstado(tarea: Tarea, nuevoEstado: string) {
    const index = this.tareas.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      this.tareas[index].estado = nuevoEstado as any;
      this.guardarEnStorage();
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

  estaVencida(fecha: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVenc = new Date(fecha);
    fechaVenc.setHours(0, 0, 0, 0);
    return fechaVenc < hoy;
  }

  exportarDatos() {
    const dataStr = JSON.stringify(this.tareas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  ordenarPor(campo: keyof Tarea) {
    this.tareasFiltradas.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }

  generarReporte() {
    const vencidas = this.tareas.filter(t => t.estado === 'pendiente' && this.estaVencida(t.fechaVencimiento)).length;
    const porPrioridad = {
      alta: this.tareas.filter(t => t.prioridad === 'alta').length,
      media: this.tareas.filter(t => t.prioridad === 'media').length,
      baja: this.tareas.filter(t => t.prioridad === 'baja').length
    };
    
    const reporte = `
=== REPORTE DE TAREAS ===
Fecha: ${new Date().toLocaleDateString()}

📊 Estadísticas Generales:
- Total Tareas: ${this.stats.total}
- Pendientes: ${this.stats.pendientes}
- En Progreso: ${this.stats.enProgreso}
- Completadas: ${this.stats.completadas}
- Vencidas: ${vencidas}

⚠️ Prioridades:
- Alta: ${porPrioridad.alta}
- Media: ${porPrioridad.media}
- Baja: ${porPrioridad.baja}

🏆 Empleados con más tareas:
${this.getEmpleadosConMasTareas()}

⏰ Próximos Vencimientos:
${this.getProximosVencimientos()}
    `;
    
    alert(reporte);
  }

  getEmpleadosConMasTareas(): string {
    const conteo: {[key: string]: number} = {};
    this.tareas.forEach(t => {
      conteo[t.asignadoA] = (conteo[t.asignadoA] || 0) + 1;
    });
    
    return Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((e, i) => `${i + 1}. ${e[0]} - ${e[1]} tareas`)
      .join('\n');
  }

  getProximosVencimientos(): string {
    return this.tareas
      .filter(t => t.estado !== 'completada' && t.estado !== 'cancelada')
      .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())
      .slice(0, 5)
      .map(t => `- ${t.titulo} (${new Date(t.fechaVencimiento).toLocaleDateString()})`)
      .join('\n');
  }
}
