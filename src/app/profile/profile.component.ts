import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CineFlixService } from '../app.service.injectable';
import { LoadingService } from '../services/app.loading.service';

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
        console.log(response);
        if (response && response.data) {
          this.usuario = response.data;
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

  createMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  guardarCambios(): void {
    this.loadingService.show();
    const body = {
      id: this.usuario.id,
      email: this.usuario.email,
      contrasena: this.usuario.contrasena,
    };

    this.cineflixservice.profileUser(this.idUser).subscribe({
      next: (res: any) => {
        this.createMessage('Datos actualizados correctamente', 'success');
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        this.createMessage('Error al actualizar los datos.', 'error');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }
}
