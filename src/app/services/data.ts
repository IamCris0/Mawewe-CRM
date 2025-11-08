import { Injectable, signal } from '@angular/core';

export interface Prospecto {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: 'nuevo' | 'contactado' | 'negociacion' | 'ganado' | 'perdido';
  fechaCreacion: Date;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  valorContrato: number;
  fechaInicio: Date;
}

export interface Empleado {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
  departamento: string;
  estado: 'activo' | 'inactivo';
}

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  asignadoA: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en-progreso' | 'completada';
  fechaVencimiento: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  // Datos Mock
  prospectos = signal<Prospecto[]>([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '0998765432', empresa: 'Tech SA', estado: 'nuevo', fechaCreacion: new Date('2024-11-01') },
    { id: 2, nombre: 'María González', email: 'maria@example.com', telefono: '0987654321', empresa: 'Innovate Corp', estado: 'contactado', fechaCreacion: new Date('2024-11-03') },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '0976543210', empresa: 'Solutions Inc', estado: 'negociacion', fechaCreacion: new Date('2024-11-05') },
  ]);

  clientes = signal<Cliente[]>([
    { id: 1, nombre: 'Pedro Sánchez', email: 'pedro@cliente.com', telefono: '0998877665', empresa: 'Empresa XYZ', valorContrato: 15000, fechaInicio: new Date('2024-10-15') },
    { id: 2, nombre: 'Ana Torres', email: 'ana@cliente.com', telefono: '0987766554', empresa: 'Global Services', valorContrato: 25000, fechaInicio: new Date('2024-09-20') },
  ]);

  empleados = signal<Empleado[]>([
    { id: 1, nombre: 'Luis Morales', email: 'luis@mawewe.com', cargo: 'Vendedor', departamento: 'Ventas', estado: 'activo' },
    { id: 2, nombre: 'Sofia López', email: 'sofia@mawewe.com', cargo: 'Gerente', departamento: 'Administración', estado: 'activo' },
    { id: 3, nombre: 'Diego Castro', email: 'diego@mawewe.com', cargo: 'Soporte', departamento: 'Técnico', estado: 'activo' },
  ]);

  tareas = signal<Tarea[]>([
    { id: 1, titulo: 'Llamar a prospecto', descripcion: 'Contactar a Juan Pérez', asignadoA: 'Luis Morales', prioridad: 'alta', estado: 'pendiente', fechaVencimiento: new Date('2024-11-10') },
    { id: 2, titulo: 'Enviar propuesta', descripcion: 'Preparar propuesta para María', asignadoA: 'Sofia López', prioridad: 'media', estado: 'en-progreso', fechaVencimiento: new Date('2024-11-12') },
    { id: 3, titulo: 'Seguimiento cliente', descripcion: 'Revisar satisfacción', asignadoA: 'Diego Castro', prioridad: 'baja', estado: 'pendiente', fechaVencimiento: new Date('2024-11-15') },
  ]);

  // Estadísticas
  getEstadisticas() {
    return {
      totalProspectos: this.prospectos().length,
      totalClientes: this.clientes().length,
      totalEmpleados: this.empleados().length,
      tareasPendientes: this.tareas().filter(t => t.estado === 'pendiente').length,
      prospectosNuevos: this.prospectos().filter(p => p.estado === 'nuevo').length,
      tasaConversion: Math.round((this.clientes().length / this.prospectos().length) * 100)
    };
  }
}