import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'component-home',
  standalone: false,
  templateUrl: './component-home.html',
  styleUrl: './component-home.css',
})
export class ComponentHome implements OnInit {
  constructor(private Route: Router) {}
  ngOnInit() {
    if (!localStorage.getItem('idUser')) {
      this.Route.navigate(['/Login']);
    }
  }
}
