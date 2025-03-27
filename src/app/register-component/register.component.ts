import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    standalone: false,
    styleUrl: './register.component.css',

})
export class registerComponent implements OnInit {
    llaveIzq = "{";
    llaveDer = "}";


    activeTemplate: string = 'register1';
    registerForm!: FormGroup;
    registerForm2!: FormGroup;
    registerForm3!: FormGroup;

    errorMessage = '';
    showMessage = false;


    constructor(private register: FormBuilder) { }

    changeTemplate(template: any) {
        this.activeTemplate = template;
    }

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            nombre: new FormControl('', [Validators.required]),
            apellidos: new FormControl('', [Validators.required]),
        });

        this.registerForm2 = new FormGroup(
            {
                email1: new FormControl('', [Validators.required, Validators.email]),
                email2: new FormControl('', [Validators.required, Validators.email]),
            },
        );

        this.registerForm3 = new FormGroup(
            {
                contraseña: new FormControl('', [Validators.required, Validators.minLength(8)]),
                confirmContraseña: new FormControl('', [Validators.required, Validators.minLength(8)]),
            },
        );
    }

    validateEqual(input1: any, input2: any, message: any) {
        const inp1 = document.getElementById(
            input1
        ) as HTMLInputElement | null;

        const inp2 = document.getElementById(
            input2
        ) as HTMLInputElement | null;

        if (inp1 && inp2) {
            const inputTC = inp1.value.trim();
            const inputCC = inp2.value.trim();

            if (inputTC != inputCC) {
                this.showMessage = true;
                this.errorMessage = message;
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            } else {
                this.errorMessage = '';
                this.changeTemplate('register3');
            }
        }
    }

    





}








