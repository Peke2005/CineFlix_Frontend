import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CineFlixService } from '../app.service.injectable';
import { Router } from '@angular/router';

@Component({
  selector: 'Panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class panelComponent implements OnInit {
  resultados: any[] = [];

  peliculas: any[] = [];
  peliculaForm = {
    titulo: '',
    descripcion: '',
    anio: '',
    duracion: 0,
    portada: '',
    trailer: '',
    actores: [] as any[]
  };


  editando = false;
  editId: number | null = null;
  creando = false;

  constructor(
    private cineflixservice: CineFlixService,
    private Route: Router
  ) {}

  ngOnInit(): void {
    this.loadPeliculas();
  }

  loadPeliculas(): void {
    this.cineflixservice.getPeliculas().subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.peliculas = response.data;
      },
      error: (err: any) => {
        console.error('Error al cargar datos del usuario:', err);
      },
    });
  }

  guardar(): void {
    if (this.editando && this.editId) {
      // Si estamos editando, llamamos al endpoint de actualización
      this.cineflixservice
        .actualizarPelicula(this.editId, this.peliculaForm)
        .subscribe(() => {
          this.resetForm();
          this.loadPeliculas(); // Recargamos las películas después de editar
        });
    } else {
      // Si estamos creando una nueva película
      this.cineflixservice.crearPelicula(this.peliculaForm).subscribe(() => {
        this.resetForm();
        this.loadPeliculas(); // Recargamos las películas después de crear
      });
    }
  }

  editar(pelicula: any): void {
    // Llenamos el formulario con los datos de la película seleccionada para editar
    this.peliculaForm = { ...pelicula };
    this.editando = true;
    this.editId = pelicula.id_pelicula!;
  }

  eliminar(id: number): void {
    // Llamamos al endpoint de eliminación
    this.cineflixservice.eliminarPelicula(id).subscribe(() => {
      this.loadPeliculas(); // Recargamos la lista después de eliminar
    });
  }

  resetForm(): void {
    // Reiniciamos el formulario
    this.peliculaForm = {
      titulo: '',
      descripcion: '',
      anio: '',
      duracion: 0,
      portada: '',
      trailer: '',
      actores: []
    };
    this.editando = false;
    this.editId = null;
  }

  crearNuevaPelicula(): void {
    this.resetForm();
    this.editando = false;
    this.creando = true;
  }
}
