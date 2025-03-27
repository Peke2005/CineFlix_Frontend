import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'Component-header',
  templateUrl: './component-header.html',
  standalone: false,
  styleUrl: './component-header.css',
})
export class ComponentHeader {
  constructor(private Route: Router) {}
  searchCategory(genre: String) {
    this.Route.navigate(['/Listar', genre]);
  }
}
