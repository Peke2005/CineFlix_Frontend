import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'Profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class profileComponent implements OnInit {
  id: Number | null = 0;
  constructor(private Route: Router) {}
  ngOnInit() {
    if (!localStorage.getItem('idUser')) {
      this.Route.navigate(['/Login']);
    }
    const id = localStorage.getItem('id');
    if (id) {
      this.id = Number(id);
    } else {
      this.id = 0;
    }
  }
}
