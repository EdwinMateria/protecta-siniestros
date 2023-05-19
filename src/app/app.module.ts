import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TratamientoCasoSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/tratamiento-caso-siniestro.component';
import { FormCasoComponent } from './components/form-caso/form-caso.component';
import { ConsultaSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import { FormSiniestroComponent } from './components/form-siniestro/form-siniestro.component';
import { ReservaSiniestroComponent } from './pages/siniestros/reserva-siniestro/reserva-siniestro.component';
import { ModalCoberturaComponent } from './pages/siniestros/reserva-siniestro/modal-cobertura/modal-cobertura.component';
import { GastosCuracionComponent } from './pages/liquidacion/gastos-curacion/gastos-curacion.component';
import { ModalGastosCoberturaComponent } from './pages/liquidacion/gastos-curacion/modal-gastos-cobertura/modal-gastos-cobertura.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    TratamientoCasoSiniestroComponent,
    FormCasoComponent,
    ConsultaSiniestroComponent,
    FormSiniestroComponent,
    ReservaSiniestroComponent,
    ModalCoberturaComponent,
    GastosCuracionComponent,
    ModalGastosCoberturaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
