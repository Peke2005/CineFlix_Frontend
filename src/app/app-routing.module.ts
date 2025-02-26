import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { registerComponent } from './register-component/register.component';


const routes: Routes = [
  { path: 'Register', component: registerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
