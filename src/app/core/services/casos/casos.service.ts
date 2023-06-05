import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { GenericResponse } from '../../models/genericResponse';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CasosBM, CombosGenericoVM } from '../../models/caso';

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   private Url = AppConfig.URL_API_SOAT;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  //GET: Culpabilidad, Causas, Departamento, Tipo Doc...
  public Index(): Observable<CasosBM> {
    return this.http.get<CasosBM>(this.Url + '/CasosManager/Index', {
      headers: this.headers
    });
  }

  public GetProvincias(nDepartamento: number): Observable<CombosGenericoVM[]> {
    return this.http.get<CombosGenericoVM[]>(this.Url + '/CasosManager/GetProvincias?nDepartamento='+ nDepartamento, {
      headers: this.headers
    });
  }

  public GetDistritos(nProvincia: number): Observable<CombosGenericoVM[]> {
    return this.http.get<CombosGenericoVM[]>(this.Url + '/CasosManager/GetDistritos?nProvincia='+nProvincia, {
      headers: this.headers
    });
  }

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

  public GetSearchCase(nnumcase: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetSearchCase?nnumcase='+ nnumcase, {
      headers: this.headers
    });
  }

  public AddCasos(data: any): Observable<any> {
    //const body = JSON.stringify(data);
    return this.http.post<any>(this.Url + '/CasosManager/AddCasos', data);
  }


  transformDate(date) {
    let a = this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need. 
    return a;
  }

}
