// src/app/components/prospectos/prospectos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';

interface Prospecto {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  estado: 'nuevo' | 'contactado' | 'interesado' | 'negociacion' | 'perdido';
  origen: string;
  fechaRegistro: Date;
  valor: number;
  notas: string;
}

@Component({
  selector: 'app-prospectos',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout],
  templateUrl: './prospectos.html',
  styleUrls: ['./prospectos.css']
})
export class Prospectos implements OnInit {
  prospectos: Prospecto[] = [];
  prospectosFiltrados: Prospecto[] = [];
  
  // Filtros
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  
  // Modal
  showModal: boolean = false;
  isEditing: boolean = false;
  
  // Formulario
  prospectoForm: Prospecto = this.getEmptyProspecto();

  // Estadísticas
  stats = {
    total: 0,
    nuevos: 0,
    contactados: 0,
    interesados: 0,
    negociacion: 0
  };

  ngOnInit() {
    this.cargarProspectos();
    this.calcularEstadisticas();
  }

  cargarProspectos() {
    // Datos de ejemplo (temporal)
    this.prospectos = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        empresa: 'Tech Solutions S.A.',
        email: 'juan.perez@techsolutions.com',
        telefono: '0999123456',
        estado: 'nuevo',
        origen: 'Web',
        fechaRegistro: new Date('2024-11-01'),
        valor: 5000,
        notas: 'Interesado en servicios de consultoría'
      },
      {
        id: 2,
        nombre: 'María García',
        empresa: 'Comercial López',
        email: 'maria.garcia@comerciallopez.com',
        telefono: '0998765432',
        estado: 'contactado',
        origen: 'Referido',
        fechaRegistro: new Date('2024-11-03'),
        valor: 8000,
        notas: 'Primera reunión programada'
      },
      {
        id: 3,
        nombre: 'Carlos Mendoza',
        empresa: 'Industrias ABC',
        email: 'carlos.mendoza@abc.com',
        telefono: '0997654321',
        estado: 'interesado',
        origen: 'LinkedIn',
        fechaRegistro: new Date('2024-11-05'),
        valor: 12000,
        notas: 'Requiere propuesta formal'
      },
      {
        id: 4,
        nombre: 'Ana Torres',
        empresa: 'Distribuidora XYZ',
        email: 'ana.torres@xyz.com',
        telefono: '0996543210',
        estado: 'negociacion',
        origen: 'Email Marketing',
        fechaRegistro: new Date('2024-11-07'),
        valor: 15000,
        notas: 'En proceso de negociación de términos'
      }
    ];
    
    this.prospectosFiltrados = [...this.prospectos];
  }

  calcularEstadisticas() {
    this.stats.total = this.prospectos.length;
    this.stats.nuevos = this.prospectos.filter(p => p.estado === 'nuevo').length;
    this.stats.contactados = this.prospectos.filter(p => p.estado === 'contactado').length;
    this.stats.interesados = this.prospectos.filter(p => p.estado === 'interesado').length;
    this.stats.negociacion = this.prospectos.filter(p => p.estado === 'negociacion').length;
  }

  filtrarProspectos() {
    this.prospectosFiltrados = this.prospectos.filter(prospecto => {
      const matchSearch = prospecto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          prospecto.empresa.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          prospecto.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchEstado = this.filtroEstado === 'todos' || prospecto.estado === this.filtroEstado;
      
      return matchSearch && matchEstado;
    });
  }

  getEmptyProspecto(): Prospecto {
    return {
      id: 0,
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      estado: 'nuevo',
      origen: '',
      fechaRegistro: new Date(),
      valor: 0,
      notas: ''
    };
  }

  abrirModal(prospecto?: Prospecto) {
    this.showModal = true;
    if (prospecto) {
      this.isEditing = true;
      this.prospectoForm = { ...prospecto };
    } else {
      this.isEditing = false;
      this.prospectoForm = this.getEmptyProspecto();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.prospectoForm = this.getEmptyProspecto();
  }

  guardarProspecto() {
    if (this.isEditing) {
      // Actualizar
      const index = this.prospectos.findIndex(p => p.id === this.prospectoForm.id);
      if (index !== -1) {
        this.prospectos[index] = { ...this.prospectoForm };
      }
    } else {
      // Crear nuevo
      this.prospectoForm.id = Math.max(...this.prospectos.map(p => p.id), 0) + 1;
      this.prospectos.push({ ...this.prospectoForm });
    }
    
    this.calcularEstadisticas();
    this.filtrarProspectos();
    this.cerrarModal();
  }

  eliminarProspecto(id: number) {
    if (confirm('¿Estás seguro de eliminar este prospecto?')) {
      this.prospectos = this.prospectos.filter(p => p.id !== id);
      this.calcularEstadisticas();
      this.filtrarProspectos();
    }
  }

  getEstadoColor(estado: string): string {
    const colores: any = {
      'nuevo': '#3b82f6',
      'contactado': '#f59e0b',
      'interesado': '#8b5cf6',
      'negociacion': '#10b981',
      'perdido': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      'nuevo': 'Nuevo',
      'contactado': 'Contactado',
      'interesado': 'Interesado',
      'negociacion': 'En Negociación',
      'perdido': 'Perdido'
    };
    return labels[estado] || estado;
  }
}