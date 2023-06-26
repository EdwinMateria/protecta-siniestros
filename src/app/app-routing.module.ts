import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TratamientoCasoSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/tratamiento-caso-siniestro.component';
import { ReservaSiniestroComponent } from './pages/siniestros/reserva-siniestro/reserva-siniestro.component';
import { GastosCuracionComponent } from './pages/liquidacion/gastos-curacion/gastos-curacion.component';
import { ReporteHistoricoComponent } from './pages/reportes/historico/reporte-historico.component';


const routes: Routes = [
  {
     path: '', component: LoginComponent, pathMatch: 'full'
  },
  { 
    path: 'home', component: HomeComponent, 
  },
  {
    path: 'tratamiento-caso-siniestro', component: TratamientoCasoSiniestroComponent
  },
  {
    path: 'reserva-siniestro', component: ReservaSiniestroComponent
  },
  {
    path: 'liquidacion-siniestro', component: GastosCuracionComponent
  },
  {
    path: 'reporte-historico', component: ReporteHistoricoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
