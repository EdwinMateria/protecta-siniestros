import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TratamientoCasoSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/tratamiento-caso-siniestro.component';


const routes: Routes = [
  {
     path: '', component: LoginComponent, pathMatch: 'full'
  },
  { 
    path: 'home', component: HomeComponent, 
  },
  {
    path: 'tratamiento-caso-siniestro', component: TratamientoCasoSiniestroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
