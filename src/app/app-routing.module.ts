import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { registerComponent } from './register-component/register.component';
import { loginComponent } from './login-component/login.component';
import { profileComponent } from './profile/profile.component';
import { ComponentHome } from './component-home/component-home';
import { componentListar } from './component-Listar/component-Listar';

const routes: Routes = [
  { path: '', component: loginComponent },
  { path: 'Register', component: registerComponent },
  { path: 'Home', component: ComponentHome },
  { path: 'Listar/:genre', component: componentListar },
  { path: 'Login', component: loginComponent },
  { path: 'Profile', component: profileComponent },
  { path: '**', redirectTo: 'Home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
