import { Component, OnInit } from '@angular/core';
import { CineFlixService } from '../app.service.injectable';
import { Router } from '@angular/router';
import { LoadingService } from '../services/app.loading.service';

@Component({
  selector: 'Panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class panelComponent implements OnInit {
  peliculas: any[] = [];
  actores: any[] = [];
  peliculaForm: any = {
    title: '',
    description: '',
    year: '',
    duration: 0,
    imageUrl: '',
    trailer: '',
    actors: [],
  };

  editando = false;
  editId: number | null = null;
  creando = false;

  constructor(
    private cineflixservice: CineFlixService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    if(localStorage.getItem("rol") != "administrador"){
      this.router.navigate(['/Home']);
    }
    this.loadingService.show();
    this.loadPeliculas();
    this.loadActores();
  }

  loadPeliculas(): void {
    this.cineflixservice.getPeliculas().subscribe({
      next: (response: any) => {
        this.peliculas = response.data;
      },
      error: (err: any) => {},
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  loadActores(): void {
    this.cineflixservice.getActores().subscribe({
      next: (response: any) => {
        this.actores = response.data;
      },
      error: (err: any) => {},
    });
  }

  guardar(): void {
    const peliculaData = {
      title: this.peliculaForm.title,
      description: this.peliculaForm.description,
      year: this.peliculaForm.year,
      duration: this.peliculaForm.duration,
      imageUrl: this.peliculaForm.imageUrl,
      trailer: this.peliculaForm.trailer,
      actors: this.peliculaForm.actors.map((actor: any) => actor.id_actor),
    };

    if (this.editando && this.editId) {
      this.cineflixservice
        .actualizarPelicula(this.editId, peliculaData)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadPeliculas();
          },
          error: (err) => {},
        });
    } else {
      this.cineflixservice.crearPelicula(peliculaData).subscribe({
        next: () => {
          this.resetForm();
          this.loadPeliculas();
        },
        error: (err) => {},
      });
    }
  }

  editar(pelicula: any): void {
    this.peliculaForm = {
      title: pelicula.title || '',
      description: pelicula.description || '',
      year: pelicula.year || '',
      duration: pelicula.duration || 0,
      imageUrl: pelicula.imageUrl || '',
      trailer: pelicula.trailer || '',
      actors: pelicula.actors.map(
        (actor: any) =>
          this.actores.find((a: any) => a.id_actor === actor.id_actor) || actor
      ),
    };
    this.editando = true;
    this.creando = false;
    this.editId = pelicula.id_pelicula || null;
  }

  eliminar(id: number): void {
    this.cineflixservice.eliminarPelicula(id).subscribe({
      next: () => this.loadPeliculas(),
      error: (err) => {},
    });
  }

  resetForm(): void {
    this.peliculaForm = {
      title: '',
      description: '',
      year: '',
      duration: 0,
      imageUrl: '',
      trailer: '',
      actors: [],
    };
    this.editando = false;
    this.creando = false;
    this.editId = null;
  }

  crearNuevaPelicula(): void {
    this.resetForm();
    this.creando = true;
    this.editando = false;
  }
}
