import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ComponentHeader } from './component-header/component-header';
import { FooterComponent } from './footer/footer.component';

import { registerComponent } from './register-component/register.component';
import { ComponentHome } from './component-home/component-home';
import { MatIconModule } from '@angular/material/icon';
import { componentListar } from './component-Listar/component-Listar';
import { loginComponent } from './login-component/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    ComponentHeader,
    FooterComponent,
    registerComponent,
    ComponentHome,
    componentListar,
    loginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
