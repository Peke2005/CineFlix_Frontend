
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
    selector: 'Login',
    templateUrl: './login.component.html',
    standalone: false,
    styleUrl: './login.component.css'
})

export class loginComponent implements OnInit {
    llaveIzq = "{";
    llaveDer = "}";
    loginForm!: FormGroup;
    message = ""
    showMessage = false;
    /*     private cineflixService: cineflixService;
     */

    ngOnInit() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }


    loginUser() {
        let email = this.loginForm?.get('email')?.value;
        let password = this.loginForm?.get('password')?.value;

        console.log(email, password)


        this.message = "Has iniciado sesion Correctamente!";
        this.showMessage = true;

        setTimeout(() => this.showMessage = false, 2000);
    }
}