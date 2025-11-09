// src/app/components/clientes/clientes.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';

interface Cliente {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  direccion: string;
  ruc: string;
  tipo: 'premium' | 'regular' | 'nuevo';
  estado: 'activo' | 'inactivo';
  fechaRegistro: Date;
  totalCompras: number;
  ultimaCompra: Date;
  notas: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  searchTerm: string = '';
  filtroTipo: string = 'todos';
  filtroEstado: string = 'todos';
  
  showModal: boolean = false;
  isEditing: boolean = false;
  
  clienteForm: Cliente = this.getEmptyCliente();

  stats = {
    total: 0,
    activos: 0,
    premium: 0,
    nuevos: 0
  };

  ngOnInit() {
    this.cargarClientes();
    this.calcularEstadisticas();
  }

  cargarClientes() {
    this.clientes = [
      {
        id: 1,
        nombre: 'María Rodríguez',
        empresa: 'Tech Innovations EC',
        email: 'maria@techinnovations.com',
        telefono: '0999888777',
        direccion: 'Av. Principal 123, Quito',
        ruc: '1792345678001',
        tipo: 'premium',
        estado: 'activo',
        fechaRegistro: new Date('2023-06-15'),
        totalCompras: 45000,
        ultimaCompra: new Date('2024-11-01'),
        notas: 'Cliente VIP - Descuento especial 15%'
      },
      {
        id: 2,
        nombre: 'Carlos Jiménez',
        empresa: 'Comercial Sur S.A.',
        email: 'carlos@comercialsur.com',
        telefono: '0998777666',
        direccion: 'Calle Comercio 456, Guayaquil',
        ruc: '0992345678001',
        tipo: 'regular',
        estado: 'activo',
        fechaRegistro: new Date('2023-09-20'),
        totalCompras: 28000,
        ultimaCompra: new Date('2024-10-28'),
        notas: 'Pago puntual - Excelente cliente'
      },
      {
        id: 3,
        nombre: 'Ana Morales',
        empresa: 'Distribuidora Norte',
        email: 'ana@distribuidoranorte.com',
        telefono: '0997666555',
        direccion: 'Av. 6 de Diciembre, Quito',
        ruc: '1792555666001',
        tipo: 'nuevo',
        estado: 'activo',
        fechaRegistro: new Date('2024-10-05'),
        totalCompras: 5500,
        ultimaCompra: new Date('2024-11-05'),
        notas: 'Cliente nuevo - Potencial de crecimiento'
      },
      {
        id: 4,
        nombre: 'Pedro Vásquez',
        empresa: 'Importadora Pacífico',
        email: 'pedro@importadorapacifico.com',
        telefono: '0996555444',
        direccion: 'Malecón 789, Guayaquil',
        ruc: '0992888999001',
        tipo: 'premium',
        estado: 'activo',
        fechaRegistro: new Date('2022-03-10'),
        totalCompras: 78000,
        ultimaCompra: new Date('2024-10-30'),
        notas: 'Mejor cliente 2023 - Programa de lealtad'
      }
    ];
    
    this.clientesFiltrados = [...this.clientes];
  }

  calcularEstadisticas() {
    this.stats.total = this.clientes.length;
    this.stats.activos = this.clientes.filter(c => c.estado === 'activo').length;
    this.stats.premium = this.clientes.filter(c => c.tipo === 'premium').length;
    this.stats.nuevos = this.clientes.filter(c => c.tipo === 'nuevo').length;
  }

  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      const matchSearch = cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          cliente.empresa.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          cliente.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchTipo = this.filtroTipo === 'todos' || cliente.tipo === this.filtroTipo;
      const matchEstado = this.filtroEstado === 'todos' || cliente.estado === this.filtroEstado;
      
      return matchSearch && matchTipo && matchEstado;
    });
  }

  getEmptyCliente(): Cliente {
    return {
      id: 0,
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      direccion: '',
      ruc: '',
      tipo: 'regular',
      estado: 'activo',
      fechaRegistro: new Date(),
      totalCompras: 0,
      ultimaCompra: new Date(),
      notas: ''
    };
  }

  abrirModal(cliente?: Cliente) {
    this.showModal = true;
    if (cliente) {
      this.isEditing = true;
      this.clienteForm = { ...cliente };
    } else {
      this.isEditing = false;
      this.clienteForm = this.getEmptyCliente();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.clienteForm = this.getEmptyCliente();
  }

  guardarCliente() {
    if (this.isEditing) {
      const index = this.clientes.findIndex(c => c.id === this.clienteForm.id);
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteForm };
      }
    } else {
      this.clienteForm.id = Math.max(...this.clientes.map(c => c.id), 0) + 1;
      this.clientes.push({ ...this.clienteForm });
    }
    
    this.calcularEstadisticas();
    this.filtrarClientes();
    this.cerrarModal();
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
      this.calcularEstadisticas();
      this.filtrarClientes();
    }
  }

  getTipoColor(tipo: string): string {
    const colores: any = {
      'premium': '#f59e0b',
      'regular': '#3b82f6',
      'nuevo': '#10b981'
    };
    return colores[tipo] || '#6b7280';
  }

  getTipoLabel(tipo: string): string {
    const labels: any = {
      'premium': 'Premium',
      'regular': 'Regular',
      'nuevo': 'Nuevo'
    };
    return labels[tipo] || tipo;
  }
}