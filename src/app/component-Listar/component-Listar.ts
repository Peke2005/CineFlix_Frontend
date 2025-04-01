import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';

@Component({
  selector: 'component-Listar',
  standalone: false,
  templateUrl: './component-Listar.html',
  styleUrl: './component-Listar.css',
})
export class componentListar implements OnInit {
  genre: string | null = null;
  movies: any[] = [];
  featuredMovie: any = null;
  categoria: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cineflixservice: CineFlixService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.genre = params.get('genre');
      console.log('Género recibido:', this.genre);
      this.loadMovies();
    });
  }

  loadMovies() {
    if (this.genre) {
      this.categoria = true;
      this.cineflixservice.getMoviesByCategory(this.genre).subscribe({
        next: (response) => {
          if (response.data) {
            this.movies = response.data;
            this.selectFeaturedMovie();
            this.errorMessage = null;
          } else {
            this.movies = [];
            this.errorMessage =
              response.message || 'No se encontraron películas.';
          }
        },
        error: (err) => {
          this.movies = [];
          this.errorMessage = 'Error al cargar las películas: ' + err.message;
        },
      });
    } else {
      this.categoria = false;
      this.cineflixservice.getAllMovies().subscribe({
        next: (response) => {
          this.movies = response.data || response;
          this.selectFeaturedMovie();
          this.errorMessage = null;
        },
        error: (err) => {
          this.movies = [];
          this.errorMessage =
            'Error al cargar todas las películas: ' + err.message;
        },
      });
    }
  }

  selectFeaturedMovie() {
    if (this.movies && this.movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.movies.length);
      this.featuredMovie = this.movies[randomIndex];
      this.movies = this.movies.filter((_, index) => index !== randomIndex);
    } else {
      this.featuredMovie = null;
    }
  }
}
