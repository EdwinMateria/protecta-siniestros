import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TratamientoCasoSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/tratamiento-caso-siniestro.component';
import { FormCasoComponent } from './components/form-caso/form-caso.component';
import { ConsultaSiniestroComponent } from './pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import { FormSiniestroComponent } from './components/form-siniestro/form-siniestro.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    TratamientoCasoSiniestroComponent,
    FormCasoComponent,
    ConsultaSiniestroComponent,
    FormSiniestroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
