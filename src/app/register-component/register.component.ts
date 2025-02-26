import { Component } from '@angular/core';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    standalone: false,
    styleUrl: './register.component.css'
})
export class registerComponent {
    llaveIzq = "{";
    llaveDer = "}";

    activeTemplate: string = 'register1';

    changeTemplate(template: string) {
        this.activeTemplate = template;
    }
}
