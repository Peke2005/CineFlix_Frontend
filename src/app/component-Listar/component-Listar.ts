import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CineFlixService } from '../app.service.injectable';

@Component({
  selector: 'component-Listar',
  standalone: false,
  templateUrl: './component-Listar.html',
  styleUrl: './component-Listar.css',
})
export class componentListar implements OnInit {
  genre: string | null = null;
  title: string | null = null;
  film: string | null = null;
  movies: any[] = [];
  featuredMovie: any = null;
  showTitle: boolean = true;
  categoria: boolean = false;
  filtradoPorTitulo: boolean = false;
  errorMessage: string | null = null;
  titlePage: string = 'Peliculas';

  paginatedMovies: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  pageNumbers: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private Route: Router,
    private cineflixservice: CineFlixService
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('idUser')) {
      this.Route.navigate(['/Login']);
    }

    this.route.paramMap.subscribe((params) => {
      this.genre = params.get('genre');
      this.title = params.get('title');
      this.film = params.get('titleFilm');
      console.log('Género recibido:', this.genre);
      console.log('Título recibido:', this.title);
      console.log('Pelicula para ver Recibida: ', this.film);
      this.loadMovies();
    });
  }

  seeFilm(film: any) {
    this.Route.navigate(['/Film', film.categories[0], film.title]);
    setTimeout(() => window.scrollTo({
      top: 0,
      left: 100,
      behavior: "smooth",
    }), 1000);
  }

  loadMovies() {
    if (this.title) {
      this.filtradoPorTitulo = true;
      this.categoria = false;
      this.cineflixservice.getMovieByName(this.title).subscribe({
        next: (response) => {
          if (response.data && Array.isArray(response.data)) {
            this.movies = response.data.filter((film: any) =>
              film.title
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .includes(this.title!.trim().toUpperCase().replace(/\s+/g, ''))
            );
            this.errorMessage = null;
            this.updatePaginatedMovies();
          } else {
            this.movies = [];
            this.errorMessage =
              response.message || 'No se encontraron películas con ese título.';
          }
        },
        error: (err) => {
          this.movies = [];
          this.errorMessage = 'Error al cargar las películas: ' + err.message;
        },
      });
    } else if (this.genre) {
      this.categoria = true;
      this.filtradoPorTitulo = false;

      this.cineflixservice.getMoviesByCategory(this.genre).subscribe({
        next: (response) => {
          if (response.data) {
            this.movies = response.data;
            this.errorMessage = null;

            if (this.film) {
              this.showTitle = false;
              this.deleteSelectedMovie(this.film, this.movies);
            }

            if (this.film) {
              this.showTitle = false;
              let m = this.movies.find((element) => element == this.film);
            }
            this.updatePaginatedMovies();
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
      this.filtradoPorTitulo = false;
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

  deleteSelectedMovie(title: string, movies: Array<any>) {
    console.log(movies);
    const index = movies.findIndex((element) => element.title === title);
    if (index !== -1) {
      movies.splice(index, 1);
    }
  }

  updatePaginatedMovies(): void {
    if (this.categoria || this.filtradoPorTitulo) {
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedMovies = this.movies.slice(startIndex, endIndex);

      const totalPages = Math.ceil(this.movies.length / this.pageSize);
      this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

      if (this.pageIndex >= totalPages && totalPages > 0) {
        this.pageIndex = totalPages - 1;
        this.updatePaginatedMovies();
      }
    }
  }

  goToPage(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.updatePaginatedMovies();
  }
}
