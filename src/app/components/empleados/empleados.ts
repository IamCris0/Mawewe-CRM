// src/app/components/empleados/empleados.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Data, Empleado } from '../../services/data';

@Component({
  selector: 'app-empleados',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados {
  private dataService = inject(Data);
  
  empleados = this.dataService.empleados;
  searchTerm = signal('');
  filterDepartamento = signal('todos');
  filterEstado = signal('todos');
  showModal = signal(false);
  
  nuevoEmpleado: Empleado = this.getEmptyEmpleado();

  departamentos = ['todos', 'Ventas', 'Administración', 'Técnico', 'Marketing', 'Finanzas'];
  estados = ['todos', 'activo', 'inactivo'];

  empleadosFiltrados = computed(() => {
    let filtered = this.empleados();
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(e => 
        e.nombre.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.cargo.toLowerCase().includes(term)
      );
    }
    
    if (this.filterDepartamento() !== 'todos') {
      filtered = filtered.filter(e => e.departamento === this.filterDepartamento());
    }
    
    if (this.filterEstado() !== 'todos') {
      filtered = filtered.filter(e => e.estado === this.filterEstado());
    }
    
    return filtered;
  });

  getTotalEmpleados() {
    return this.empleados().length;
  }

  getEmpleadosActivos() {
    return this.empleados().filter(e => e.estado === 'activo').length;
  }

  getEmpleadosPorDepartamento(depto: string) {
    return this.empleados().filter(e => e.departamento === depto).length;
  }

  getEmptyEmpleado(): Empleado {
    return {
      id: Date.now(),
      nombre: '',
      email: '',
      cargo: '',
      departamento: 'Ventas',
      estado: 'activo'
    };
  }

  openModal() {
    this.nuevoEmpleado = this.getEmptyEmpleado();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  guardarEmpleado() {
    if (this.nuevoEmpleado.nombre && this.nuevoEmpleado.email) {
      this.empleados.update(current => [...current, this.nuevoEmpleado]);
      this.closeModal();
    }
  }

  eliminarEmpleado(id: number) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleados.update(current => current.filter(e => e.id !== id));
    }
  }

  cambiarEstado(id: number) {
    this.empleados.update(current => 
      current.map(e => 
        e.id === id 
          ? { ...e, estado: e.estado === 'activo' ? 'inactivo' : 'activo' as 'activo' | 'inactivo' }
          : e
      )
    );
  }

  getEstadoClass(estado: string): string {
    return estado === 'activo' ? 'badge-active' : 'badge-inactive';
  }
}