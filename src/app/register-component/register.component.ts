import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CineFlixService } from '../app.service.injectable';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrl: './register.component.css',
})
export class registerComponent implements OnInit {
  llaveIzq = '{';
  llaveDer = '}';

  activeTemplate: string = 'register1';
  registerForm!: FormGroup;
  registerForm2!: FormGroup;
  registerForm3!: FormGroup;

  message = '';
  showMessage = false;
  errorMessage = '';
  isSubmitting = false;
  messageType: 'success' | 'error' = 'success';

  constructor(
    private register: FormBuilder,
    private router: Router,
    private cineflixservice: CineFlixService
  ) {}

  changeTemplate(template: any) {
    this.message = '';
    this.errorMessage = '';
    this.activeTemplate = template;
  }

  ngOnInit(): void {
    if (localStorage.getItem('idUser')) {
      this.router.navigate(['/Home']);
    }
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
    });

    this.registerForm2 = new FormGroup({
      email1: new FormControl('', [Validators.required, Validators.email]),
      email2: new FormControl('', [Validators.required, Validators.email]),
    });

    this.registerForm3 = new FormGroup({
      contraseña: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmContraseña: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  validateEqual(input1: any, input2: any, message: any) {
    const inp1 = document.getElementById(input1) as HTMLInputElement | null;

    const inp2 = document.getElementById(input2) as HTMLInputElement | null;

    if (inp1 && inp2) {
      const inputTC = inp1.value.trim();
      const inputCC = inp2.value.trim();

      if (inputTC != inputCC) {
        this.showMessage = true;
        this.errorMessage = message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      } else {
        this.errorMessage = '';

        if (this.activeTemplate != 'register3') {
          this.changeTemplate('register3');
        } else {
          this.onRegister();
          this.isSubmitting = true;
        }
      }
    }
  }

  createMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.showMessage = true;
    this.messageType = type;

    setTimeout(() => {
      this.showMessage = false;
      this.errorMessage = '';
    }, 2000);
  }

  onRegister() {
    let user = {
      nombre:
        this.registerForm.get('nombre')?.value +
        ' ' +
        this.registerForm.get('apellidos')?.value,
      email: this.registerForm2.get('email2')?.value,
      pass: this.registerForm3.get('confirmContraseña')?.value,
    };

    this.cineflixservice.registerUser(user).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('idUser', response.id);
        this.createMessage(response.logError, 'success');

        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.createMessage(err.error.logError, 'error');
      },
    });
    this.isSubmitting = false;
  }
}
