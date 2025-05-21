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
import { ComponentFilm } from './component-film/component-film';
import { PerfilComponent } from './profile/profile.component';
import { LoadingComponent } from './loading/loading.component';
import { panelComponent } from './panel/panel.component';
import { HistorialComponent } from './historial/historial.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentHeader,
    FooterComponent,
    registerComponent,
    ComponentHome,
    ComponentFilm,
    componentListar,
    loginComponent,
    PerfilComponent,
    LoadingComponent,
    panelComponent,
    HistorialComponent,
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
  exports: [componentListar],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
