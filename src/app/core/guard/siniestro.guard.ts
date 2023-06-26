import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthProtectaService } from '../services/auth-protecta/auth-protecta.service';

@Injectable({
  providedIn: 'root'
})
export class SiniestroGuard implements CanActivate {

  constructor(public authProtectaService: AuthProtectaService) { }

  canActivate() {
    console.log('guard');
    
    if (this.authProtectaService.getCookie('AppSiniestro') != "") {
      return true;
    } else {
      window.location.href = 'http://localhost:55556';
      return false
    }
  }
  
}
