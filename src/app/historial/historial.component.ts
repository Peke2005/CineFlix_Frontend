import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';
import { LoadingService } from '../services/app.loading.service';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  movies: any[] = [];

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
          this.movies = (data.peliculas || []).map((movie: any) => ({
            year: movie.año,
            category: movie.categorías,
            description: movie.descripcion,
            duration: movie.duracion,
            fecha_vista: movie.fecha_vista,
            id_pelicula: movie.id_pelicula,
            imageUrl: movie.portada,
            title: movie.titulo,
          }));
          console.log('Historial data:', this.movies);
          if (this.movies.length === 0) {
            console.warn('No movies found in historial');
          }
        },
        error: (err) => {
          console.error('Error fetching historial:', err);
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

  seeFilm(movie: any) {
    this.loadingService.show();
    this.router.navigate(['/Film', movie.categorías[0], movie.title]);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 100,
        behavior: 'smooth',
      });
      this.loadingService.hide();
    }, 1000);
  }
}
