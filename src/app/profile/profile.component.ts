import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CineFlixService } from '../app.service.injectable';
import { LoadingService } from '../services/app.loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'Profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class PerfilComponent implements OnInit {
  hovering: boolean = false;

  usuario: any = {
    id: '',
    nombre: '',
    email: '',
    contraseña: '',
    imagen: '',
  };

  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;
  newEmail: string = '';
  confirmEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  tempEmail: string = '';
  tempPassword: string = '';

  idUser: any = localStorage.getItem('idUser');

  message: string = '';
  messageType: 'success' | 'error' = 'success';
  showMessage: boolean = false;

  constructor(
    private http: HttpClient,
    private cineflixservice: CineFlixService,
    private loadingService: LoadingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.show();
    if (!localStorage.getItem('idUser')) {
      this.router.navigate(['/Login']);
      this.loadingService.hide();
      return;
    }
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.loadingService.show();
    this.cineflixservice.profileUser(this.idUser).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          setTimeout(() => {
            this.usuario = response.data;
            this.tempEmail = this.usuario.email;
            this.tempPassword = this.usuario.contraseña;
            this.usuario.imagen = response.data.imagen || '';
            this.cdr.detectChanges();
          });
        }
      },
      error: (err: any) => {
        console.error('Error al cargar datos del usuario:', err);
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  openEmailModal(): void {
    this.showEmailModal = true;
    this.newEmail = this.tempEmail;
    this.confirmEmail = '';
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
  }

  saveEmail(): void {
    const trimmedNewEmail = this.newEmail.trim();
    const trimmedConfirmEmail = this.confirmEmail.trim();

    if (trimmedNewEmail === trimmedConfirmEmail && trimmedNewEmail !== '') {
      this.tempEmail = trimmedNewEmail;
      this.closeEmailModal();
    } else {
      this.createMessage('Los correos no coinciden o están vacíos', 'error');
    }
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  savePassword(): void {
    const trimmedNewPassword = this.newPassword.trim();
    const trimmedConfirmPassword = this.confirmPassword.trim();

    if (
      trimmedNewPassword === trimmedConfirmPassword &&
      trimmedNewPassword !== ''
    ) {
      this.tempPassword = trimmedNewPassword;
      this.closePasswordModal();
    } else {
      this.createMessage(
        'Las contraseñas no coinciden o están vacías',
        'error'
      );
    }
  }

  guardarCambios(): void {
    this.usuario.email = this.tempEmail;
    this.usuario.contraseña = this.tempPassword;

    const body = {
      id: this.usuario.id,
      email: this.usuario.email,
      contrasena: this.usuario.contraseña,
    };

    this.cineflixservice.updateUser(body).subscribe({
      next: () => {
        this.createMessage('Datos actualizados correctamente', 'success');
        this.cargarDatosUsuario();
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        this.createMessage('Error al actualizar los datos', 'error');
      },
    });
  }

  createMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      this.createMessage('Solo se permiten archivos PNG o JPG', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.idUser);
    formData.append('imagen', file);

    this.http.post('http://localhost:8000/uploadImage', formData).subscribe({
      next: () => {
        this.cargarDatosUsuario();
        this.createMessage('Imagen actualizada correctamente', 'success');
      },
      error: () => {
        this.createMessage('Error al subir la imagen', 'error');
      },
    });
  }
}
