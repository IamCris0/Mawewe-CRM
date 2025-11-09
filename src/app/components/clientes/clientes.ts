// src/app/components/clientes/clientes.ts - VERSIÓN MEJORADA
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
  formErrors: { [key: string]: string } = {};

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
    const stored = localStorage.getItem('clientes');
    if (stored) {
      this.clientes = JSON.parse(stored).map((c: any) => ({
        ...c,
        fechaRegistro: new Date(c.fechaRegistro),
        ultimaCompra: new Date(c.ultimaCompra)
      }));
    } else {
      // Datos de ejemplo iniciales
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
        }
      ];
      this.guardarEnStorage();
    }
    
    this.clientesFiltrados = [...this.clientes];
  }

  guardarEnStorage() {
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
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

  validarFormulario(): boolean {
    this.formErrors = {};
    let valido = true;

    // Validar nombre
    if (!this.clienteForm.nombre.trim()) {
      this.formErrors['nombre'] = 'El nombre es requerido';
      valido = false;
    } else if (this.clienteForm.nombre.length < 3) {
      this.formErrors['nombre'] = 'El nombre debe tener al menos 3 caracteres';
      valido = false;
    }

    // Validar empresa
    if (!this.clienteForm.empresa.trim()) {
      this.formErrors['empresa'] = 'La empresa es requerida';
      valido = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.clienteForm.email.trim()) {
      this.formErrors['email'] = 'El email es requerido';
      valido = false;
    } else if (!emailRegex.test(this.clienteForm.email)) {
      this.formErrors['email'] = 'Email inválido';
      valido = false;
    }

    // Validar teléfono
    const telefonoRegex = /^[0-9]{10}$/;
    if (!this.clienteForm.telefono.trim()) {
      this.formErrors['telefono'] = 'El teléfono es requerido';
      valido = false;
    } else if (!telefonoRegex.test(this.clienteForm.telefono.replace(/\s/g, ''))) {
      this.formErrors['telefono'] = 'Teléfono debe tener 10 dígitos';
      valido = false;
    }

    // Validar RUC
    const rucRegex = /^[0-9]{13}$/;
    if (!this.clienteForm.ruc.trim()) {
      this.formErrors['ruc'] = 'El RUC es requerido';
      valido = false;
    } else if (!rucRegex.test(this.clienteForm.ruc)) {
      this.formErrors['ruc'] = 'RUC debe tener 13 dígitos';
      valido = false;
    }

    // Validar total compras
    if (this.clienteForm.totalCompras < 0) {
      this.formErrors['totalCompras'] = 'El total de compras no puede ser negativo';
      valido = false;
    }

    return valido;
  }

  abrirModal(cliente?: Cliente) {
    this.showModal = true;
    this.formErrors = {};
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
    this.formErrors = {};
  }

  guardarCliente() {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.isEditing) {
      const index = this.clientes.findIndex(c => c.id === this.clienteForm.id);
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteForm };
      }
    } else {
      this.clienteForm.id = Math.max(...this.clientes.map(c => c.id), 0) + 1;
      this.clienteForm.fechaRegistro = new Date();
      this.clienteForm.ultimaCompra = new Date();
      this.clientes.unshift({ ...this.clienteForm });
    }
    
    this.guardarEnStorage();
    this.calcularEstadisticas();
    this.filtrarClientes();
    this.cerrarModal();
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
      this.guardarEnStorage();
      this.calcularEstadisticas();
      this.filtrarClientes();
    }
  }

  cambiarEstado(cliente: Cliente, nuevoEstado: string) {
    const index = this.clientes.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      this.clientes[index].estado = nuevoEstado as any;
      this.guardarEnStorage();
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

  exportarDatos() {
    const dataStr = JSON.stringify(this.clientes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  ordenarPor(campo: keyof Cliente) {
    this.clientesFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }

  generarReporte() {
    const ventasTotales = this.clientes.reduce((sum, c) => sum + c.totalCompras, 0);
    const promedioCompras = ventasTotales / this.clientes.length;
    
    const reporte = `
=== REPORTE DE CLIENTES ===
Fecha: ${new Date().toLocaleDateString()}

📊 Estadísticas Generales:
- Total Clientes: ${this.stats.total}
- Clientes Activos: ${this.stats.activos}
- Clientes Premium: ${this.stats.premium}
- Clientes Nuevos: ${this.stats.nuevos}

💰 Información Financiera:
- Ventas Totales: $${ventasTotales.toLocaleString()}
- Promedio por Cliente: $${promedioCompras.toFixed(2)}

🏆 Top 3 Clientes:
${this.clientes
  .sort((a, b) => b.totalCompras - a.totalCompras)
  .slice(0, 3)
  .map((c, i) => `${i + 1}. ${c.nombre} - $${c.totalCompras.toLocaleString()}`)
  .join('\n')}
    `;
    
    alert(reporte);
  }
}