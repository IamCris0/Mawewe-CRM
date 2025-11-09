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
  estado: 'nuevo' | 'contactado' | 'interesado' | 'negociacion' | 'perdido' | 'convertido';
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
  
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  
  showModal: boolean = false;
  isEditing: boolean = false;
  
  prospectoForm: Prospecto = this.getEmptyProspecto();
  formErrors: { [key: string]: string } = {};

  stats = {
    total: 0,
    nuevos: 0,
    contactados: 0,
    negociacion: 0
  };

  ngOnInit() {
    this.cargarProspectos();
    this.calcularEstadisticas();
  }

  cargarProspectos() {
    const stored = localStorage.getItem('prospectos');
    if (stored) {
      this.prospectos = JSON.parse(stored).map((p: any) => ({
        ...p,
        fechaRegistro: new Date(p.fechaRegistro)
      }));
    } else {
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
      this.guardarEnStorage();
    }
    
    this.prospectosFiltrados = [...this.prospectos];
  }

  guardarEnStorage() {
    localStorage.setItem('prospectos', JSON.stringify(this.prospectos));
  }

  calcularEstadisticas() {
    this.stats.total = this.prospectos.length;
    this.stats.nuevos = this.prospectos.filter(p => p.estado === 'nuevo').length;
    this.stats.contactados = this.prospectos.filter(p => p.estado === 'contactado').length;
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
      origen: 'Web',
      fechaRegistro: new Date(),
      valor: 0,
      notas: ''
    };
  }

  abrirModal(prospecto?: Prospecto) {
    this.showModal = true;
    this.formErrors = {};
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
    this.formErrors = {};
  }

  validarFormulario(): boolean {
    this.formErrors = {};
    let valido = true;

    if (!this.prospectoForm.nombre.trim()) {
      this.formErrors['nombre'] = 'El nombre es requerido';
      valido = false;
    }

    if (!this.prospectoForm.empresa.trim()) {
      this.formErrors['empresa'] = 'La empresa es requerida';
      valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.prospectoForm.email.trim()) {
      this.formErrors['email'] = 'El email es requerido';
      valido = false;
    } else if (!emailRegex.test(this.prospectoForm.email)) {
      this.formErrors['email'] = 'Email inválido';
      valido = false;
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (!this.prospectoForm.telefono.trim()) {
      this.formErrors['telefono'] = 'El teléfono es requerido';
      valido = false;
    } else if (!telefonoRegex.test(this.prospectoForm.telefono.replace(/\s/g, ''))) {
      this.formErrors['telefono'] = 'Teléfono debe tener 10 dígitos';
      valido = false;
    }

    if (this.prospectoForm.valor < 0) {
      this.formErrors['valor'] = 'El valor no puede ser negativo';
      valido = false;
    }

    return valido;
  }

  guardarProspecto() {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.isEditing) {
      const index = this.prospectos.findIndex(p => p.id === this.prospectoForm.id);
      if (index !== -1) {
        this.prospectos[index] = { ...this.prospectoForm };
      }
    } else {
      this.prospectoForm.id = Math.max(...this.prospectos.map(p => p.id), 0) + 1;
      this.prospectoForm.fechaRegistro = new Date();
      this.prospectos.unshift({ ...this.prospectoForm });
    }
    
    this.guardarEnStorage();
    this.calcularEstadisticas();
    this.filtrarProspectos();
    this.cerrarModal();
  }

  eliminarProspecto(id: number) {
    if (confirm('¿Estás seguro de eliminar este prospecto? Esta acción no se puede deshacer.')) {
      this.prospectos = this.prospectos.filter(p => p.id !== id);
      this.guardarEnStorage();
      this.calcularEstadisticas();
      this.filtrarProspectos();
    }
  }

  cambiarEstado(prospecto: Prospecto, nuevoEstado: string) {
    const index = this.prospectos.findIndex(p => p.id === prospecto.id);
    if (index !== -1) {
      this.prospectos[index].estado = nuevoEstado as any;
      this.guardarEnStorage();
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
      'perdido': '#ef4444',
      'convertido': '#059669'
    };
    return colores[estado] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      'nuevo': 'Nuevo',
      'contactado': 'Contactado',
      'interesado': 'Interesado',
      'negociacion': 'En Negociación',
      'perdido': 'Perdido',
      'convertido': 'Convertido'
    };
    return labels[estado] || estado;
  }

  exportarDatos() {
    const dataStr = JSON.stringify(this.prospectos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prospectos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  ordenarPor(campo: keyof Prospecto) {
    this.prospectosFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }
}