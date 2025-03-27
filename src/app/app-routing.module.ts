import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { registerComponent } from './register-component/register.component';
import { loginComponent } from './login-component/login.component';


const routes: Routes = [
  { path: 'Register', component: registerComponent },
  { path: 'Login', component: loginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }