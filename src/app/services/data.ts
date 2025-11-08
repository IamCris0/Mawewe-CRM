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
  // Datos Mock - AMPLIADOS
  prospectos = signal<Prospecto[]>([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '0998765432', empresa: 'Tech SA', estado: 'nuevo', fechaCreacion: new Date('2024-11-01') },
    { id: 2, nombre: 'María González', email: 'maria@example.com', telefono: '0987654321', empresa: 'Innovate Corp', estado: 'contactado', fechaCreacion: new Date('2024-11-03') },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '0976543210', empresa: 'Solutions Inc', estado: 'negociacion', fechaCreacion: new Date('2024-11-05') },
    { id: 4, nombre: 'Laura Mendoza', email: 'laura@example.com', telefono: '0965432109', empresa: 'Digital SA', estado: 'nuevo', fechaCreacion: new Date('2024-11-06') },
    { id: 5, nombre: 'Roberto Silva', email: 'roberto@example.com', telefono: '0954321098', empresa: 'Cloud Tech', estado: 'ganado', fechaCreacion: new Date('2024-10-28') },
  ]);

  clientes = signal<Cliente[]>([
    { id: 1, nombre: 'Pedro Sánchez', email: 'pedro@cliente.com', telefono: '0998877665', empresa: 'Empresa XYZ', valorContrato: 15000, fechaInicio: new Date('2024-10-15') },
    { id: 2, nombre: 'Ana Torres', email: 'ana@cliente.com', telefono: '0987766554', empresa: 'Global Services', valorContrato: 25000, fechaInicio: new Date('2024-09-20') },
    { id: 3, nombre: 'Miguel Ángel', email: 'miguel@cliente.com', telefono: '0976655443', empresa: 'Mega Corp', valorContrato: 18500, fechaInicio: new Date('2024-11-01') },
  ]);

  empleados = signal<Empleado[]>([
    { id: 1, nombre: 'Luis Morales', email: 'luis@mawewe.com', cargo: 'Vendedor Senior', departamento: 'Ventas', estado: 'activo' },
    { id: 2, nombre: 'Sofia López', email: 'sofia@mawewe.com', cargo: 'Gerente General', departamento: 'Administración', estado: 'activo' },
    { id: 3, nombre: 'Diego Castro', email: 'diego@mawewe.com', cargo: 'Soporte Técnico', departamento: 'Técnico', estado: 'activo' },
    { id: 4, nombre: 'Carla Vega', email: 'carla@mawewe.com', cargo: 'Vendedora', departamento: 'Ventas', estado: 'activo' },
    { id: 5, nombre: 'Fernando Ríos', email: 'fernando@mawewe.com', cargo: 'Analista', departamento: 'Finanzas', estado: 'activo' },
    { id: 6, nombre: 'Patricia Gómez', email: 'patricia@mawewe.com', cargo: 'Diseñadora', departamento: 'Marketing', estado: 'inactivo' },
  ]);

  tareas = signal<Tarea[]>([
    { id: 1, titulo: 'Llamar a prospecto Juan', descripcion: 'Contactar para presentar propuesta comercial', asignadoA: 'Luis Morales', prioridad: 'alta', estado: 'pendiente', fechaVencimiento: new Date('2024-11-10') },
    { id: 2, titulo: 'Enviar propuesta a María', descripcion: 'Preparar y enviar cotización detallada', asignadoA: 'Sofia López', prioridad: 'media', estado: 'en-progreso', fechaVencimiento: new Date('2024-11-12') },
    { id: 3, titulo: 'Seguimiento cliente XYZ', descripcion: 'Revisar nivel de satisfacción', asignadoA: 'Diego Castro', prioridad: 'baja', estado: 'pendiente', fechaVencimiento: new Date('2024-11-15') },
    { id: 4, titulo: 'Reunión de equipo', descripcion: 'Planificación mensual de objetivos', asignadoA: 'Sofia López', prioridad: 'media', estado: 'pendiente', fechaVencimiento: new Date('2024-11-09') },
    { id: 5, titulo: 'Cerrar venta Cloud Tech', descripcion: 'Finalizar negociación y firma de contrato', asignadoA: 'Carla Vega', prioridad: 'alta', estado: 'en-progreso', fechaVencimiento: new Date('2024-11-08') },
    { id: 6, titulo: 'Actualizar CRM', descripcion: 'Ingresar datos de nuevos prospectos', asignadoA: 'Luis Morales', prioridad: 'baja', estado: 'completada', fechaVencimiento: new Date('2024-11-05') },
    { id: 7, titulo: 'Capacitación equipo ventas', descripcion: 'Sesión de nuevas técnicas de cierre', asignadoA: 'Sofia López', prioridad: 'media', estado: 'completada', fechaVencimiento: new Date('2024-11-02') },
  ]);

  // Estadísticas
  getEstadisticas() {
    const totalProspectos = this.prospectos().length;
    const totalClientes = this.clientes().length;
    
    return {
      totalProspectos,
      totalClientes,
      totalEmpleados: this.empleados().length,
      tareasPendientes: this.tareas().filter(t => t.estado === 'pendiente').length,
      prospectosNuevos: this.prospectos().filter(p => p.estado === 'nuevo').length,
      tasaConversion: totalProspectos > 0 ? Math.round((totalClientes / totalProspectos) * 100) : 0
    };
  }
}