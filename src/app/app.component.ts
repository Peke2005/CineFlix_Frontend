import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'CineFlixFrontend';
  mostrarFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.mostrarFooter = this.router.url !== '/login';
    });
  }
}