import { Component, OnInit } from '@angular/core';
import { AuthProtectaService } from './core/services/auth-protecta/auth-protecta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import configVersion from '../assets/config.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // title = 'protecta-siniestros';

  constructor(private httpClient: HttpClient) {
  }
  private config: { version: string };
  ngOnInit() {
    var require: any
    this.config = configVersion;
    console.log(this.config.version);

    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    this.httpClient
      .get<{ version: string }>("./assets/config.json", { headers })
      .subscribe(config => {
        if (config.version !== this.config.version) {
          location.reload();
        }
      });
  }
}
