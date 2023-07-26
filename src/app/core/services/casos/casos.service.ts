import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { GenericResponse } from '../../models/genericResponse';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AutocompleteBE, CasosBM, CombosGenericoVM } from '../../models/caso';
import { SiniestroBM } from '../../models/siniestroBM';

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   private Url = AppConfig.URL_API_SINIESTROS;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  //GET: Culpabilidad, Causas, Departamento, Tipo Doc...
  public Index(): Observable<CasosBM> {
    return this.http.get<CasosBM>(this.Url + '/CasosManager/Index', {
      headers: this.headers
    });
  }

  public ValidateCase(casos: CasosBM): Observable<any> {
    //const body = JSON.stringify(data);
    return this.http.post<any>(this.Url + '/CasosManager/ValidateCase', casos);
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

  public GetPolicyForCase(npolicy: number, docurdate: any): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetPolicyForCase?npolicy='+ npolicy + '&docurdate='+ docurdate, {
      headers: this.headers
    });
  }

  public GetSearchCase(nnumcase: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetSearchCase?nnumcase='+ nnumcase, {
      headers: this.headers
    });
  }

  public GetClaimForCase(nnumcase: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetClaimForCase?nnumcase='+ nnumcase, {
      headers: this.headers
    });
  }

  public GetSearchClaim(Siniestro: number, nproceso: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.Url + '/CasosManager/GetSearchClaim?Siniestro='+ Siniestro + '&Nproceso=' +  nproceso, {
      headers: this.headers
    });
  }

  public AddCasos(data: any): Observable<any> {
    //const body = JSON.stringify(data);
    return this.http.post<any>(this.Url + '/CasosManager/AddCasos', data);
  }

  public UpdateCase(data: CasosBM): Observable<any> {
    //const body = JSON.stringify(data);
    return this.http.post<any>(this.Url + '/CasosManager/UpdateCase', data);
  }

  
  public AddSiniestros(data: any): Observable<any> {
    return this.http.post<any>(this.Url + '/CasosManager/AddSiniestros', data);
  }

  public AddReopening(data: any): Observable<any> {
    return this.http.post<any>(this.Url + '/CasosManager/AddReopening', data);
  }
  
  public UpdateClaim(data: SiniestroBM): Observable<any> {
    return this.http.post<any>(this.Url + '/CasosManager/UpdateClaim', data);
  }
  
  public AddRechazo(data: any): Observable<any> {
    return this.http.post<any>(this.Url + '/CasosManager/AddRechazo', data);
  }

  public Delegaciones(delegacion: string): Observable<AutocompleteBE[]> {
    return this.http.get<AutocompleteBE[]>(this.Url + '/CasosManager/Delegaciones?sDeleg='+ delegacion, {
      headers: this.headers
    });
  }

  transformDate(date) {
    let a = this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need. 
    return a;
  }

}
