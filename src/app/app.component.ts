import { Component } from '@angular/core';
import { AuthProtectaService } from './core/services/auth-protecta/auth-protecta.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'protecta-siniestros';

  constructor() {
  }
}
