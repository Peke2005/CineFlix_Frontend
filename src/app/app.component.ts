import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'CineFlixFrontend';
  mostrarFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.mostrarFooter = this.router.url !== '/login'; // Oculta el footer en /login
    });
  }
}