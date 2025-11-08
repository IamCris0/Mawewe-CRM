import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Data, Cliente } from '../../services/data';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  private dataService = inject(Data);
  
  clientes = this.dataService.clientes;
  searchTerm = signal('');
  showModal = signal(false);
  
  nuevoCliente: Cliente = this.getEmptyCliente();

  clientesFiltrados = computed(() => {
    let filtered = this.clientes();
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(c => 
        c.nombre.toLowerCase().includes(term) ||
        c.empresa.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  });

  getTotalClientes() {
    return this.clientes().length;
  }

  getValorTotalContratos() {
    return this.clientes().reduce((sum, c) => sum + c.valorContrato, 0);
  }

  getEmptyCliente(): Cliente {
    return {
      id: Date.now(),
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      valorContrato: 0,
      fechaInicio: new Date()
    };
  }

  openModal() {
    this.nuevoCliente = this.getEmptyCliente();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  guardarCliente() {
    if (this.nuevoCliente.nombre && this.nuevoCliente.email) {
      this.clientes.update(current => [...current, this.nuevoCliente]);
      this.closeModal();
    }
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientes.update(current => current.filter(c => c.id !== id));
    }
  }
}