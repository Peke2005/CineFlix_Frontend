import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CineFlixService } from '../app.service.injectable';

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
    contraseña: ''
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

  constructor(private http: HttpClient, private cineflixservice: CineFlixService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
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
      }
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
}