import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './services/app.loading.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CineFlixFrontend';
  mostrarHeaderFooter: boolean = true;
  isLoading$: any;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;

    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.mostrarHeaderFooter =
        url !== '/Register' && url !== '/Login' && url !== '/';
    });
  }
}
