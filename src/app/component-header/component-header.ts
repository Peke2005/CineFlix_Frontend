import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';

@Component({
  selector: 'Component-header',
  templateUrl: './component-header.html',
  standalone: false,
  styleUrl: './component-header.css',
})
export class ComponentHeader {
  resultados: any[] = [];

  constructor(
    private Route: Router,
    private cineflixservice: CineFlixService
  ) {}

  logOut() {
    if (localStorage.getItem('idUser')) {
      localStorage.removeItem('idUser');
      this.Route.navigate(['/Login']);
    }
  }

  searchCategory(genre: String) {
    this.Route.navigate(['/Listar/genre', genre]);
  }

  searchFlimName() {
    const searchInput = document.getElementById(
      'nameFilm'
    ) as HTMLInputElement | null;
    if (searchInput) {
      const title = searchInput.value.trim();
      if (this.resultados != null) {
        this.resultados = [];
      }

      this.cineflixservice.getMovieByName(title).subscribe({
        next: (response) => {
          console.log(response.data);
          if (response.data && Array.isArray(response.data)) {
            this.resultados = response.data.filter((film: any) =>
              film.title
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .includes(title.trim().toUpperCase().replace(/\s+/g, ''))
            );
            if (this.resultados.length > 0) {
              console.log('Navigating to:', '/Listar/title', title);
              this.Route.navigate(['/Listar/title', title]);
            }
          } else {
            this.resultados = [];
          }
        },
        error: (err) => {
          console.error('Error fetching movies:', err);
          this.resultados = [];
        },
      });
    }
  }
}
