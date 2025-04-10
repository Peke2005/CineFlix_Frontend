import { Component, OnInit } from '@angular/core';
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
  usuario: any = {
    id: '',
    nombre: '',
    email: '',
    contraseña: '',
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
  private apiUrl = `http://127.0.0.1:8000/userSearchById?id=${this.idUser}`;

  message: string = '';
  messageType: 'success' | 'error' = 'success';
  showMessage: boolean = false;

  constructor(
    private http: HttpClient,
    private cineflixservice: CineFlixService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

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
        console.log(response);
        if (response && response.data) {
          this.usuario = response.data;
          this.tempEmail = this.usuario.email;
          this.tempPassword = this.usuario.contraseña;
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

    console.log('newEmail:', trimmedNewEmail);
    console.log('confirmEmail:', trimmedConfirmEmail);

    if (trimmedNewEmail === trimmedConfirmEmail && trimmedNewEmail !== '') {
      this.tempEmail = trimmedNewEmail;
      this.closeEmailModal();
    } else {
      alert('Los correos no coinciden o están vacíos');
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

    if (trimmedNewPassword === trimmedConfirmPassword && trimmedNewPassword !== '') {
      this.tempPassword = trimmedNewPassword;
      this.closePasswordModal();
    } else {
      alert('Las contraseñas no coinciden o están vacías');
    }
  }

  guardarCambios(): void {
    this.usuario.email = this.tempEmail;
    this.usuario.contraseña = this.tempPassword;

    const body = {
      id: this.usuario.id,
      email: this.usuario.email,
      contrasena: this.usuario.contraseña
    };

    this.cineflixservice.updateUser(body).subscribe({
      next: (res: any) => {
        alert('Datos actualizados correctamente');
        this.cargarDatosUsuario();
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar los datos.');
      }
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
}



