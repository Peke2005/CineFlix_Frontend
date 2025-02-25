import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ComponentHeader } from './component-header/component-header';
import { FooterComponent } from './footer/footer.component';

import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent, ComponentHeader, FooterComponent],
  imports: [BrowserModule, AppRoutingModule, MatIconModule],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
