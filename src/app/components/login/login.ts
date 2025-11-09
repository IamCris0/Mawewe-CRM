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
  isLoading = signal(false);

  // Validaciones en tiempo real
  emailError = signal('');
  passwordError = signal('');

  constructor(private router: Router) {
    // Verificar si ya está logueado
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  validateEmail(): boolean {
    const emailValue = this.email();
    if (!emailValue) {
      this.emailError.set('El correo es requerido');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      this.emailError.set('Ingresa un correo válido');
      return false;
    }
    
    this.emailError.set('');
    return true;
  }

  validatePassword(): boolean {
    const passwordValue = this.password();
    if (!passwordValue) {
      this.passwordError.set('La contraseña es requerida');
      return false;
    }
    
    if (passwordValue.length < 6) {
      this.passwordError.set('Mínimo 6 caracteres');
      return false;
    }
    
    this.passwordError.set('');
    return true;
  }

  onLogin() {
    // Limpiar mensajes previos
    this.errorMessage.set('');
    
    // Validar campos
    const emailValid = this.validateEmail();
    const passwordValid = this.validatePassword();
    
    if (!emailValid || !passwordValid) {
      return;
    }

    // Simular loading
    this.isLoading.set(true);

    // Simular delay de API
    setTimeout(() => {
      // Validación de credenciales
      if (this.email() === 'admin@mawewe.com' && this.password() === 'admin123') {
        // Login exitoso
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', this.email());
        localStorage.setItem('loginTime', new Date().toISOString());
        
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('⚠️ Credenciales incorrectas. Intenta con admin@mawewe.com / admin123');
        this.isLoading.set(false);
      }
    }, 800);
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Limpiar errores al escribir
  onEmailInput() {
    if (this.emailError()) {
      this.emailError.set('');
    }
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  onPasswordInput() {
    if (this.passwordError()) {
      this.passwordError.set('');
    }
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }
}