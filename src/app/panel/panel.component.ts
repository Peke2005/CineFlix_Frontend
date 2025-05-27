import { Component, OnInit } from '@angular/core';
import { CineFlixService } from '../app.service.injectable';
import { Router } from '@angular/router';
import { LoadingService } from '../services/app.loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'Panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class panelComponent implements OnInit {
  peliculas: any[] = [];
  actores: any[] = [];
  peliculaForm: FormGroup;
  editando = false;
  editId: number | null = null;
  creando = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  showDeleteModal: boolean = false;
  deleteMovieId: number | null = null;
  deleteMovieTitle: string = '';

  constructor(
    private cineflixservice: CineFlixService,
    private router: Router,
    private loadingService: LoadingService,
    private fb: FormBuilder
  ) {
    this.peliculaForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      year: ['', [Validators.required]],
      duration: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['', [Validators.required]],
      trailer: ['', [Validators.required]],
      actors: [[], [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('rol') !== 'administrador') {
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
        this.totalItems = this.peliculas.length;
      },
      error: (err: any) => {
        this.errorMessage = 'Error al cargar películas';
      },
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
      error: (err: any) => {
        this.errorMessage = 'Error al cargar actores';
      },
    });
  }

  get paginatedPeliculas(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.peliculas.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  guardar(): void {
    if (this.peliculaForm.invalid) {
      this.peliculaForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const title = this.peliculaForm.get('title')?.value;
    const isDuplicate = this.peliculas.some(
      (p) =>
        p.title.toLowerCase() === title.toLowerCase() &&
        (!this.editando || p.id_pelicula !== this.editId)
    );

    if (isDuplicate) {
      this.errorMessage = 'Ya existe una película con este título';
      return;
    }

    const peliculaData = {
      title: this.peliculaForm.get('title')?.value,
      description: this.peliculaForm.get('description')?.value,
      year: this.peliculaForm.get('year')?.value,
      duration: this.peliculaForm.get('duration')?.value,
      imageUrl: this.peliculaForm.get('imageUrl')?.value,
      trailer: this.peliculaForm.get('trailer')?.value,
      actors: this.peliculaForm
        .get('actors')
        ?.value.map((actor: any) => actor.id_actor),
    };

    this.loadingService.show();
    if (this.editando && this.editId) {
      this.cineflixservice
        .actualizarPelicula(this.editId, peliculaData)
        .subscribe({
          next: () => {
            this.successMessage = 'Película actualizada con éxito';
            this.resetForm();
            this.loadPeliculas();
          },
          error: (err) => {
            this.errorMessage = 'Error al actualizar la película';
          },
          complete: () => {
            this.loadingService.hide();
          },
        });
    } else {
      this.cineflixservice.crearPelicula(peliculaData).subscribe({
        next: () => {
          this.successMessage = 'Película creada con éxito';
          this.resetForm();
          this.loadPeliculas();
        },
        error: (err) => {
          this.errorMessage = 'Error al crear la película';
        },
        complete: () => {
          this.loadingService.hide();
        },
      });
    }
  }

  editar(pelicula: any): void {
    this.peliculaForm.setValue({
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
    });
    this.editando = true;
    this.creando = false;
    this.editId = pelicula.id_pelicula || null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  openDeleteModal(id: number, title: string): void {
    this.deleteMovieId = id;
    this.deleteMovieTitle = title;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteMovieId = null;
    this.deleteMovieTitle = '';
  }

  confirmDelete(): void {
    if (this.deleteMovieId) {
      this.loadingService.show();
      this.cineflixservice.eliminarPelicula(this.deleteMovieId).subscribe({
        next: () => {
          this.successMessage = 'Película eliminada con éxito';
          this.loadPeliculas();
          this.closeDeleteModal();
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar la película';
          this.closeDeleteModal();
        },
        complete: () => {
          this.loadingService.hide();
        },
      });
    }
  }

  resetForm(): void {
    this.peliculaForm.reset({
      title: '',
      description: '',
      year: '',
      duration: 0,
      imageUrl: '',
      trailer: '',
      actors: [],
    });
    this.editando = false;
    this.creando = false;
    this.editId = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  crearNuevaPelicula(): void {
    this.resetForm();
    this.creando = true;
    this.editando = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.peliculaForm.get(field);
    return control
      ? control.invalid && (control.touched || control.dirty)
      : false;
  }
}
