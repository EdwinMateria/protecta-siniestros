import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TratamientoCasoSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/tratamiento-caso-siniestro.component';
import { ReservaSiniestroComponent } from './pages/siniestros/reserva-siniestro/reserva-siniestro.component';
import { GastosCuracionComponent } from './pages/liquidacion/gastos-curacion/gastos-curacion.component';
import { ReaperturaSiniestroComponent } from './pages/siniestros/reapertura-siniestro/reapertura-siniestro.component';
import { SiniestroGuard } from './core/guard/siniestro.guard';


const routes: Routes = [
  {
     path: '', component: HomeComponent, pathMatch: 'full'
  },
  { 
    path: 'home', component: HomeComponent
  },
  {
    path: 'tratamiento-caso-siniestro', component: TratamientoCasoSiniestroComponent,  canActivate: [SiniestroGuard]
  },
  {
    path: 'reserva-siniestro', component: ReservaSiniestroComponent,  canActivate: [SiniestroGuard]
  },
  {
    path: 'liquidacion-siniestro', component: GastosCuracionComponent,  canActivate: [SiniestroGuard]
  },
  {
    path: 'reapertura-siniestro', component: ReaperturaSiniestroComponent,  canActivate: [SiniestroGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
