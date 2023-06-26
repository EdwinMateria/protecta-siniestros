import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public authProtectaService: AuthProtectaService, public route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      let usuario = params['usuario'];
      if(usuario != undefined){
        let codigo = params['codigo'];
        let apeP = params['apeP'];
        let apeM = params['apeM'];
        let nomUsuario = params['nomUsuario'];
        let nomCUsu = params['nomCUsu'];
        let OpcMenH = params['OpcMenH'];
        let OpcMenD = params['OpcMenD'];
        this.authProtectaService.setCookie(usuario, codigo, apeP, apeM, nomUsuario, nomCUsu, OpcMenH, OpcMenD);
        this.router.navigateByUrl('/home')
      }else{
        if (this.authProtectaService.getCookie('AppSiniestro') == "") {
          window.location.href = AppConfig.URL_SINIESTROS_WEB;
        }
      }
  });
  }

  ngOnInit(): void {
    console.log('home');
    
  }

}
