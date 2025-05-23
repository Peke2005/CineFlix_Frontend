import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';
import { LoadingService } from '../services/app.loading.service';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit, AfterViewInit {
  movies: any[] = [];
  isAtStart: boolean = true;
  isAtEnd: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private cineflixService: CineFlixService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show();
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.cineflixService.getHistorial(userId).subscribe({
        next: (data) => {
          if (data.peliculas.length == 0) {
            this.errorMessage = 'No se encontraron películas recientes vistas';
          }
          this.movies = (data.peliculas || []).map((movie: any) => ({
            year: movie.año,
            category: movie.categories,
            description: movie.descripcion,
            duration: movie.duracion,
            fecha_vista: movie.fecha_vista,
            id_pelicula: movie.id,
            imageUrl: movie.portada,
            title: movie.titulo,
          }));
          setTimeout(() => this.updateButtonStates(), 100);
        },
        error: (err) => {
          console.error('Error fetching historial:', err);
          this.loadingService.hide();
        },
        complete: () => {
          this.loadingService.hide();
        },
      });
    } else {
      console.error('No user ID found in localStorage');
      this.loadingService.hide();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateButtonStates(), 200);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateButtonStates();
  }

  seeFilm(movie: any) {
    this.loadingService.show();
    this.router.navigate(['/Film', movie.category[0], movie.title]);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadingService.hide();
    }, 1000);
  }

  scrollRight() {
    const grid = document.querySelector('.movie-grid') as HTMLElement;
    if (grid) {
      const scrollAmount = 270;
      grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(() => this.updateButtonStates(), 400);
    }
  }

  scrollLeft() {
    const grid = document.querySelector('.movie-grid') as HTMLElement;
    if (grid) {
      const scrollAmount = 270;
      grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setTimeout(() => this.updateButtonStates(), 400);
    }
  }

  updateButtonStates() {
    const grid = document.querySelector('.movie-grid') as HTMLElement;
    if (!grid) return;

    const scrollLeft = grid.scrollLeft;
    const scrollWidth = grid.scrollWidth;
    const clientWidth = grid.clientWidth;

    this.isAtStart = scrollLeft <= 5;
    this.isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;
  }
}
