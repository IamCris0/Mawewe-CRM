// src/app/components/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from '../layout/layout';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  change: string;
  trend: 'up' | 'down';
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Layout],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  stats: StatCard[] = [
    {
      title: 'Prospectos',
      value: 45,
      icon: '👥',
      color: '#667eea',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Clientes Activos',
      value: 128,
      icon: '🤝',
      color: '#10b981',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Empleados',
      value: 24,
      icon: '👨‍💼',
      color: '#f59e0b',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Tareas Pendientes',
      value: 18,
      icon: '✅',
      color: '#ef4444',
      change: '-5',
      trend: 'down'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      type: 'prospecto',
      description: 'Nuevo prospecto agregado: Juan Pérez',
      time: 'Hace 5 minutos',
      icon: '👤'
    },
    {
      type: 'cliente',
      description: 'Cliente María García realizó una compra',
      time: 'Hace 1 hora',
      icon: '🛒'
    },
    {
      type: 'tarea',
      description: 'Tarea completada: Seguimiento cliente ABC',
      time: 'Hace 2 horas',
      icon: '✓'
    },
    {
      type: 'empleado',
      description: 'Nuevo empleado registrado: Carlos López',
      time: 'Hace 3 horas',
      icon: '👨‍💼'
    }
  ];

  ngOnInit() {
    // Aquí puedes cargar datos reales cuando tengas el backend
  }
}