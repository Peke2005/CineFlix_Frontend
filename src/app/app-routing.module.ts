import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { registerComponent } from './register-component/register.component';
import { ComponentHome } from './component-home/component-home';
import { componentListar } from './component-Listar/component-Listar';

const routes: Routes = [
  { path: 'Register', component: registerComponent },
  { path: 'Home', component: ComponentHome },
  { path: 'Listar/:genre', component: componentListar },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
