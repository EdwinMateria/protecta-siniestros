import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { GenericResponse } from '../../models/genericResponse';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   private Url = AppConfig.URL_API_SOAT;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public GetCulpabilidadList(): Observable<GenericResponse> {
    const body = JSON.stringify({});
    return this.http.post<GenericResponse>(this.Url + '/CasosManager/GetCulpabilidadList', body, {
      headers: this.headers,
    });
  }

  public GetCausaSiniestroList(): Observable<GenericResponse> {
    const body = JSON.stringify({});
    return this.http.post<GenericResponse>(this.Url + '/CasosManager/GetCausaSiniestroList', body, {
      headers: this.headers,
    });
  }

  public GetPolicyForCase(npolicy: number, docurdate: Date): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetPolicyForCase?npolicy='+ npolicy + '&docurdate='+ this.transformDate(docurdate), {
      headers: this.headers
    });
  }

  transformDate(date) {
    let a = this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need. 
    return a;
  }

}
