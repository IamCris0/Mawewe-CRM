// src/app/components/prospectos/prospectos.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Data, Prospecto } from '../../services/data';

@Component({
  selector: 'app-prospectos',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './prospectos.html',
  styleUrl: './prospectos.css',
})
export class Prospectos {
  private dataService = inject(Data);
  
  prospectos = this.dataService.prospectos;
  searchTerm = signal('');
  filterEstado = signal('todos');
  showModal = signal(false);
  
  nuevoProspecto: Prospecto = this.getEmptyProspecto();

  estados = ['todos', 'nuevo', 'contactado', 'negociacion', 'ganado', 'perdido'];

  // Usar computed en lugar de getter
  prospectosFiltrados = computed(() => {
    let filtered = this.prospectos();
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        p.empresa.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
      );
    }
    
    if (this.filterEstado() !== 'todos') {
      filtered = filtered.filter(p => p.estado === this.filterEstado());
    }
    
    return filtered;
  });

  // Métodos para contar por estado
  getTotalProspectos() {
    return this.prospectos().length;
  }

  getProspectosPorEstado(estado: string) {
    return this.prospectos().filter(p => p.estado === estado).length;
  }

  getEmptyProspecto(): Prospecto {
    return {
      id: Date.now(),
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      estado: 'nuevo',
      fechaCreacion: new Date()
    };
  }

  openModal() {
    this.nuevoProspecto = this.getEmptyProspecto();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  guardarProspecto() {
    if (this.nuevoProspecto.nombre && this.nuevoProspecto.email) {
      this.prospectos.update(current => [...current, this.nuevoProspecto]);
      this.closeModal();
    }
  }

  eliminarProspecto(id: number) {
    if (confirm('¿Estás seguro de eliminar este prospecto?')) {
      this.prospectos.update(current => current.filter(p => p.id !== id));
    }
  }

  getEstadoClass(estado: string): string {
    const clases: any = {
      'nuevo': 'badge-new',
      'contactado': 'badge-contacted',
      'negociacion': 'badge-negotiation',
      'ganado': 'badge-won',
      'perdido': 'badge-lost'
    };
    return clases[estado] || '';
  }
}