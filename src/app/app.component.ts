import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CineFlixFrontend';
  mostrarHeaderFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.mostrarHeaderFooter = url !== '/Register' && url !== '/Login' && url !== '/';
    });
  }

}
