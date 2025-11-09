// src/app/components/empleados/empleados.ts - VERSIÓN MEJORADA
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
  formErrors: { [key: string]: string } = {};

  stats = {
    total: 0,
    activos: 0,
    ventas: 0,
    departamentos: 0
  };

  departamentos = ['Ventas', 'Marketing', 'Soporte', 'Administración', 'Logística', 'RRHH', 'IT'];

  ngOnInit() {
    this.cargarEmpleados();
    this.calcularEstadisticas();
  }

  cargarEmpleados() {
    const stored = localStorage.getItem('empleados');
    if (stored) {
      this.empleados = JSON.parse(stored).map((e: any) => ({
        ...e,
        fechaIngreso: new Date(e.fechaIngreso)
      }));
    } else {
      // Datos de ejemplo iniciales
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
        }
      ];
      this.guardarEnStorage();
    }
    
    this.empleadosFiltrados = [...this.empleados];
  }

  guardarEnStorage() {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
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

  validarFormulario(): boolean {
    this.formErrors = {};
    let valido = true;

    // Validar nombre
    if (!this.empleadoForm.nombre.trim()) {
      this.formErrors['nombre'] = 'El nombre es requerido';
      valido = false;
    } else if (this.empleadoForm.nombre.length < 3) {
      this.formErrors['nombre'] = 'El nombre debe tener al menos 3 caracteres';
      valido = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.empleadoForm.email.trim()) {
      this.formErrors['email'] = 'El email es requerido';
      valido = false;
    } else if (!emailRegex.test(this.empleadoForm.email)) {
      this.formErrors['email'] = 'Email inválido';
      valido = false;
    }

    // Validar teléfono
    const telefonoRegex = /^[0-9]{10}$/;
    if (!this.empleadoForm.telefono.trim()) {
      this.formErrors['telefono'] = 'El teléfono es requerido';
      valido = false;
    } else if (!telefonoRegex.test(this.empleadoForm.telefono.replace(/\s/g, ''))) {
      this.formErrors['telefono'] = 'Teléfono debe tener 10 dígitos';
      valido = false;
    }

    // Validar cargo
    if (!this.empleadoForm.cargo.trim()) {
      this.formErrors['cargo'] = 'El cargo es requerido';
      valido = false;
    }

    // Validar salario
    if (this.empleadoForm.salario < 0) {
      this.formErrors['salario'] = 'El salario no puede ser negativo';
      valido = false;
    } else if (this.empleadoForm.salario < 450) {
      this.formErrors['salario'] = 'El salario debe ser mayor al mínimo (450)';
      valido = false;
    }

    // Validar desempeño
    if (this.empleadoForm.desempeño < 0 || this.empleadoForm.desempeño > 100) {
      this.formErrors['desempeño'] = 'El desempeño debe estar entre 0 y 100';
      valido = false;
    }

    return valido;
  }

  abrirModal(empleado?: Empleado) {
    this.showModal = true;
    this.formErrors = {};
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
    this.formErrors = {};
  }

  guardarEmpleado() {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.isEditing) {
      const index = this.empleados.findIndex(e => e.id === this.empleadoForm.id);
      if (index !== -1) {
        this.empleados[index] = { ...this.empleadoForm };
      }
    } else {
      this.empleadoForm.id = Math.max(...this.empleados.map(e => e.id), 0) + 1;
      this.empleadoForm.fechaIngreso = new Date();
      this.empleados.unshift({ ...this.empleadoForm });
    }
    
    this.guardarEnStorage();
    this.calcularEstadisticas();
    this.filtrarEmpleados();
    this.cerrarModal();
  }

  eliminarEmpleado(id: number) {
    if (confirm('¿Estás seguro de eliminar este empleado? Esta acción no se puede deshacer.')) {
      this.empleados = this.empleados.filter(e => e.id !== id);
      this.guardarEnStorage();
      this.calcularEstadisticas();
      this.filtrarEmpleados();
    }
  }

  cambiarEstado(empleado: Empleado, nuevoEstado: string) {
    const index = this.empleados.findIndex(e => e.id === empleado.id);
    if (index !== -1) {
      this.empleados[index].estado = nuevoEstado as any;
      this.guardarEnStorage();
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

  exportarDatos() {
    const dataStr = JSON.stringify(this.empleados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `empleados_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  ordenarPor(campo: keyof Empleado) {
    this.empleadosFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }

  generarReporte() {
    const nominaTotal = this.empleados.reduce((sum, e) => sum + e.salario, 0);
    const promedioSalario = nominaTotal / this.empleados.length;
    const desempeñoPromedio = this.empleados.reduce((sum, e) => sum + e.desempeño, 0) / this.empleados.length;
    
    const reporte = `
=== REPORTE DE EMPLEADOS ===
Fecha: ${new Date().toLocaleDateString()}

📊 Estadísticas Generales:
- Total Empleados: ${this.stats.total}
- Empleados Activos: ${this.stats.activos}
- Departamentos: ${this.stats.departamentos}
- Ventas Totales del Equipo: ${this.stats.ventas}

💰 Información Salarial:
- Nómina Total: $${nominaTotal.toLocaleString()}
- Salario Promedio: $${promedioSalario.toFixed(2)}

📈 Desempeño:
- Promedio General: ${desempeñoPromedio.toFixed(2)}%

🏆 Top 3 Empleados por Desempeño:
${this.empleados
  .sort((a, b) => b.desempeño - a.desempeño)
  .slice(0, 3)
  .map((e, i) => `${i + 1}. ${e.nombre} - ${e.desempeño}%`)
  .join('\n')}

👥 Distribución por Departamento:
${Array.from(new Set(this.empleados.map(e => e.departamento)))
  .map(dept => {
    const count = this.empleados.filter(e => e.departamento === dept).length;
    return `${dept}: ${count} empleados`;
  })
  .join('\n')}
    `;
    
    alert(reporte);
  }
}