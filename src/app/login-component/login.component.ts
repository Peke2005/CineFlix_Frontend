import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { CineFlixService } from '../app.service.injectable';
import { Router } from '@angular/router';

@Component({
  selector: 'Login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: './login.component.css',
})
export class loginComponent implements OnInit {
  constructor(
    private router: Router,
    private cineflixservice: CineFlixService
  ) {}

  llaveIzq = '{';
  llaveDer = '}';
  loginForm!: FormGroup;
  message = '';
  showMessage = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit() {
    if (localStorage.getItem('idUser')) {
      this.router.navigate(['/Home']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  createMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.showMessage = true;
    this.messageType = type;

    setTimeout(() => {
      this.showMessage = false;
    }, 2000);
  }

  loginUser() {
    let user = {
      email: this.loginForm?.get('email')?.value,
      pass: this.loginForm?.get('password')?.value,
    };
    this.cineflixservice.loginUser(user).subscribe({
      next: (response) => {
        localStorage.setItem('idUser', response.id);
        localStorage.setItem('nameUser', response.name);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('foto_perfil', response.foto_perfil);
        this.createMessage(response.logError, 'success');

        setTimeout(() => {
          if (response.rol == 'administrador') {
            this.router.navigate(['/Panel']);
          } else {
            this.router.navigate(['/Home']);
          }
        }, 2000);
      },
      error: (err) => {
        this.createMessage(err.error.logError, 'error');
      },
    });
  }
}
