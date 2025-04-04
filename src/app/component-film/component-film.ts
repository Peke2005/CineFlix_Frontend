import { Component, OnInit } from '@angular/core';
import { ParamMap } from '@angular/router';
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
  constructor(private Route: Router, private route: ActivatedRoute, private cineflixService: CineFlixService, private sanitizer: DomSanitizer
  ) { }

  trailerUrl!: SafeResourceUrl;


  film: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.cineflixService.getMovieByName(params.get('titleFilm')).subscribe({
        next: (response) => {
          this.film = response.data[0];
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.trailer);
        },
        error: (err) => {
          console.log(err)
        },
      })
    });
  }


}
