import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthProtectaService {

  constructor(public router: Router) { }

  public getCookie(name: string) {

    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    // let ca: Array<string> = document.cookie.split(';');
    // let caLen: number = ca.length;
    // let cookieName = `${name}=`;
    // let c: string;

    // for (let i: number = 0; i < caLen; i += 1) {
    //   c = ca[i].replace(/^\s+/g, '');
    //   if (c.indexOf(cookieName) == 0) {
    //     return c.substring(cookieName.length, c.length);
    //   }
    // }
    // return '';
  }

  public getValueCookie(name:string, cookie: string){
    let values = cookie.split('&');
    let nameLength = name.length;
    for (let i = 0; i < values.length; i++) {
      if(values[i].includes(name)){
        let valorCookie = values[i].slice(nameLength + 1);
        return valorCookie
      }
    }
  }

//, codigo: any, apeP: any , apeM: any , nomUsuario: any , nomCUsu: any , OpcMenH: any , OpcMenD: any
  public  setCookie(usuario: any, codigo: any, apeP: any , apeM: any , nomUsuario: any , nomCUsu: any , OpcMenH: any , OpcMenD: any) {
    const expirationDays = 7; // Duración en días

    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = '; expires=' + date.toUTCString();
    document.cookie = 'AppSiniestro = Usuario=' +   usuario + "&CodUsu=" + codigo + "&NomUsu=" + nomUsuario + "&ApePUsu=" + apeP + "&ApeMUsu=" + apeM + "&NomCUsu=" +  nomCUsu + "&OpcMenH=" + OpcMenH + "&OpcMenD=" + OpcMenD + expires + '; path=/';
    return true;
  }


}
