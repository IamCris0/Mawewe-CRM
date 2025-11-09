// src/app/components/layout/layout.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  sidebarOpen = true;
  userEmail = '';
  showUserMenu = false;

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '👥', label: 'Prospectos', route: '/prospectos' },
    { icon: '🤝', label: 'Clientes', route: '/clientes' },
    { icon: '👨‍💼', label: 'Empleados', route: '/empleados' },
    { icon: '✅', label: 'Tareas', route: '/tareas' }
  ];

  constructor(private router: Router) {
    this.userEmail = localStorage.getItem('userEmail') || 'usuario@mawewe.com';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}