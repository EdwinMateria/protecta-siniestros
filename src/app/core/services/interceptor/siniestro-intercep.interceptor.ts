import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthProtectaService } from '../auth-protecta/auth-protecta.service';
import { AppConfig } from 'src/app/app.config';

@Injectable()
export class SiniestroIntercepInterceptor implements HttpInterceptor {

  constructor(public authProtectaService: AuthProtectaService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let cookie = this.authProtectaService.getCookie('AppSiniestro');
    if(cookie == ''){
      window.location.href = AppConfig.URL_SINIESTROS_WEB
    }

    return next.handle(request);
  }
}
