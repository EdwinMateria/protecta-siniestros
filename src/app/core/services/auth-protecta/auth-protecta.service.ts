import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthProtectaService {

  constructor() { }

  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
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
  public setCookie(usuario: any, codigo: any, apeP: any , apeM: any , nomUsuario: any , nomCUsu: any , OpcMenH: any , OpcMenD: any) {
    document.cookie = "AppSiniestro=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = 'AppSiniestro = Usuario=' +   usuario + "&CodUsu=" + codigo + "&NomUsu=" + nomUsuario + "&ApePUsu=" + apeP + "&ApeMUsu=" + apeM + "&NomCUsu=" +  nomCUsu + "&OpcMenH=" + OpcMenH + "&OpcMenD=" + OpcMenD
  }


}
