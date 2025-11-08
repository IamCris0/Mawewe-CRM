// src/app/components/login/login.ts
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  errorMessage = signal('');

  constructor(private router: Router) {}

  onLogin() {
    // Validación simple para el borrador
    if (this.email() === 'admin@mawewe.com' && this.password() === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.email());
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Credenciales incorrectas. Usa admin@mawewe.com / admin123');
    }
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
}