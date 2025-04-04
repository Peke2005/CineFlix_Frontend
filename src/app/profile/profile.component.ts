import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'Profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class profileComponent implements OnInit {
  id: Number | null = 0;

  ngOnInit() {
    const id = localStorage.getItem('id');
    if (id) {
      this.id = Number(id);
    } else {
      this.id = 0;
    }
  }
}
