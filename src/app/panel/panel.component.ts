
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CineFlixService } from '../app.service.injectable';



@Component({
    selector: 'Panel',
    templateUrl: './panel.component.html',
    standalone: false,
    styleUrl: './panel.component.css'
})

export class panelComponent implements OnInit {

    constructor(
        private cineflixservice: CineFlixService,
    ) { }

    movies: any[] = [];
    errorMessage = ""
    showMessage = false;
    messageType: 'success' | 'error' = 'success';

    ngOnInit() {

        this.cineflixservice.getAllMovies().subscribe({
            next: (response) => {
                console.log(response)
            },
            error: (err) => {
                this.movies = [];
                this.createMessage('Error al cargar todas las películas: ' + err.message, "error");
            },

        });
    }

    createMessage(message: string, type: 'success' | 'error') {
        this.errorMessage = message;
        this.showMessage = true;
        this.messageType = type;

        setTimeout(() => {
            this.showMessage = false;
        }, 2000)
    }

}