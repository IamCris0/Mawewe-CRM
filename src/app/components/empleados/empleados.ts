// src/app/components/empleados/empleados.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';

interface Empleado {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
  departamento: string;
  fechaIngreso: Date;
  salario: number;
  estado: 'activo' | 'vacaciones' | 'inactivo';
  desempeño: number;
  ventasRealizadas: number;
  notas: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout],
  templateUrl: './empleados.html',
  styleUrls: ['./empleados.css']
})
export class Empleados implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  
  searchTerm: string = '';
  filtroDepartamento: string = 'todos';
  filtroEstado: string = 'todos';
  
  showModal: boolean = false;
  isEditing: boolean = false;
  
  empleadoForm: Empleado = this.getEmptyEmpleado();

  stats = {
    total: 0,
    activos: 0,
    ventas: 0,
    departamentos: 0
  };

  departamentos = ['Ventas', 'Marketing', 'Soporte', 'Administración', 'Logística'];

  ngOnInit() {
    this.cargarEmpleados();
    this.calcularEstadisticas();
  }

  cargarEmpleados() {
    this.empleados = [
      {
        id: 1,
        nombre: 'Carlos Mendoza',
        email: 'carlos.mendoza@mawewe.com',
        telefono: '0999111222',
        cargo: 'Gerente de Ventas',
        departamento: 'Ventas',
        fechaIngreso: new Date('2022-01-15'),
        salario: 2500,
        estado: 'activo',
        desempeño: 95,
        ventasRealizadas: 35,
        notas: 'Mejor empleado del mes - Octubre 2024'
      },
      {
        id: 2,
        nombre: 'Ana Torres',
        email: 'ana.torres@mawewe.com',
        telefono: '0998222333',
        cargo: 'Ejecutiva de Cuentas',
        departamento: 'Ventas',
        fechaIngreso: new Date('2022-06-20'),
        salario: 1800,
        estado: 'activo',
        desempeño: 88,
        ventasRealizadas: 28,
        notas: 'Excelente atención al cliente'
      },
      {
        id: 3,
        nombre: 'Luis Ramírez',
        email: 'luis.ramirez@mawewe.com',
        telefono: '0997333444',
        cargo: 'Especialista en Marketing',
        departamento: 'Marketing',
        fechaIngreso: new Date('2023-02-10'),
        salario: 1600,
        estado: 'activo',
        desempeño: 82,
        ventasRealizadas: 0,
        notas: 'Responsable de redes sociales'
      },
      {
        id: 4,
        nombre: 'María González',
        email: 'maria.gonzalez@mawewe.com',
        telefono: '0996444555',
        cargo: 'Coordinadora de Soporte',
        departamento: 'Soporte',
        fechaIngreso: new Date('2021-09-05'),
        salario: 1500,
        estado: 'vacaciones',
        desempeño: 90,
        ventasRealizadas: 0,
        notas: 'De vacaciones hasta el 15/11'
      },
      {
        id: 5,
        nombre: 'Pedro Vásquez',
        email: 'pedro.vasquez@mawewe.com',
        telefono: '0995555666',
        cargo: 'Asistente Administrativo',
        departamento: 'Administración',
        fechaIngreso: new Date('2023-05-12'),
        salario: 1200,
        estado: 'activo',
        desempeño: 85,
        ventasRealizadas: 0,
        notas: 'Encargado de facturación'
      }
    ];
    
    this.empleadosFiltrados = [...this.empleados];
  }

  calcularEstadisticas() {
    this.stats.total = this.empleados.length;
    this.stats.activos = this.empleados.filter(e => e.estado === 'activo').length;
    this.stats.ventas = this.empleados
      .filter(e => e.departamento === 'Ventas')
      .reduce((sum, e) => sum + e.ventasRealizadas, 0);
    this.stats.departamentos = new Set(this.empleados.map(e => e.departamento)).size;
  }

  filtrarEmpleados() {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      const matchSearch = empleado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          empleado.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          empleado.cargo.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchDepartamento = this.filtroDepartamento === 'todos' || empleado.departamento === this.filtroDepartamento;
      const matchEstado = this.filtroEstado === 'todos' || empleado.estado === this.filtroEstado;
      
      return matchSearch && matchDepartamento && matchEstado;
    });
  }

  getEmptyEmpleado(): Empleado {
    return {
      id: 0,
      nombre: '',
      email: '',
      telefono: '',
      cargo: '',
      departamento: 'Ventas',
      fechaIngreso: new Date(),
      salario: 0,
      estado: 'activo',
      desempeño: 0,
      ventasRealizadas: 0,
      notas: ''
    };
  }

  abrirModal(empleado?: Empleado) {
    this.showModal = true;
    if (empleado) {
      this.isEditing = true;
      this.empleadoForm = { ...empleado };
    } else {
      this.isEditing = false;
      this.empleadoForm = this.getEmptyEmpleado();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.empleadoForm = this.getEmptyEmpleado();
  }

  guardarEmpleado() {
    if (this.isEditing) {
      const index = this.empleados.findIndex(e => e.id === this.empleadoForm.id);
      if (index !== -1) {
        this.empleados[index] = { ...this.empleadoForm };
      }
    } else {
      this.empleadoForm.id = Math.max(...this.empleados.map(e => e.id), 0) + 1;
      this.empleados.push({ ...this.empleadoForm });
    }
    
    this.calcularEstadisticas();
    this.filtrarEmpleados();
    this.cerrarModal();
  }

  eliminarEmpleado(id: number) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleados = this.empleados.filter(e => e.id !== id);
      this.calcularEstadisticas();
      this.filtrarEmpleados();
    }
  }

  getEstadoColor(estado: string): string {
    const colores: any = {
      'activo': '#10b981',
      'vacaciones': '#f59e0b',
      'inactivo': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      'activo': 'Activo',
      'vacaciones': 'Vacaciones',
      'inactivo': 'Inactivo'
    };
    return labels[estado] || estado;
  }

  getDesempeñoColor(desempeño: number): string {
    if (desempeño >= 90) return '#10b981';
    if (desempeño >= 75) return '#f59e0b';
    return '#ef4444';
  }
}