import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'component-film',
  standalone: false,
  templateUrl: './component-film.html',
  styleUrl: './component-film.css',
})
export class ComponentFilm implements OnInit {
  constructor(
    private Route: Router,
    private route: ActivatedRoute,
    private cineflixService: CineFlixService,
    private sanitizer: DomSanitizer
  ) {}

  trailerUrl!: SafeResourceUrl;
  film: any;
  
  showActors: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.cineflixService.getMovieByName(params.get('titleFilm')).subscribe({
        next: (response) => {
          this.film = response.data[0];
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.film.trailer
          );
          console.log(this.film);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  formatFechaNacimiento(fecha: string | null): string {
    if (!fecha || fecha === 'undefined/00:00:00.0000000/') {
      return 'No disponible';
    }

    const partes = fecha.split(' ');
    console.log(partes);
    const fechaParte = partes[0];

    if (!fechaParte) {
      return 'No disponible';
    }

    const fechaPartes = fechaParte.split('-');
    return `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;
  }
}
