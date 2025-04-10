import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  idUser : any = localStorage.getItem('idUser');
  if (idUser:any) {
    this.apiUrl = `http://127.0.0.1:8000/userSearchById?id=${this.idUser}`;
  }

  private apiUrl = `http://127.0.0.1:8000/userSearchById?id=${this.idUser}`;
  
  constructor(private http : HttpClient, private cineflixservice:CineFlixService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }
  
  cargarDatosUsuario(): void {
    this.cineflixservice.profileUser(this.idUser).subscribe({    
      next: (response: any) => {
        console.log(response);
        if (response && response.data) {
          this.usuario = response.data;
        }
      },
      error: (err: any) => {
        console.error('Error al cargar datos del usuario:', err);
      }
    });
  }

  guardarCambios(): void {
    const body = {
      id: this.usuario.id,
      email: this.usuario.email,
      contrasena: this.usuario.contrasena
    };
    
  /* LLAMA ENDPOINT ACTUALIZAR */
    this.cineflixservice.profileUser(this.idUser).subscribe({
      next: (res : any) => {
        alert('Datos actualizados correctamente');
      },
      error: (err : any) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar los datos.');
      }
    });
  }  
}

