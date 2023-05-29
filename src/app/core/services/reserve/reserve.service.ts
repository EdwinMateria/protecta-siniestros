import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';
import { ClaimRequest } from '../../models/claimRequest';
import { ClaimResponse } from '../../models/claimResponse';
import { ClaimComboResponse } from '../../models/claimComboResponse';
import { ClaimCodDiagnosticoRequest } from '../../models/claimCodDiagnosticoRequest';
import { ClaimCodDiagnosticoResponse } from '../../models/claimCodDiagnosticoResponse';
import { ClaimBeneficiarioModelRequestBM } from '../../models/claimBeneficiarioModelRequest';
import { ClaimCaseDataRequest } from '../../models/claimCaseDataRequest';
import { ClaimCoverResponse } from '../../models/claimCoverResponse';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

   private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   private Url = AppConfig.URL_API_SOAT;

  constructor(private http: HttpClient) { }

  public GetClaim(data: ClaimRequest): Observable<ClaimResponse[]> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimResponse[]>(this.Url + '/Reserve/GetClaim', body, {
      headers: this.headers,
    });
  }

  public GetComboGeneral(): Observable<ClaimComboResponse[]> {
    const body = JSON.stringify({});
    return this.http.post<ClaimComboResponse[]>(this.Url + '/Reserve/GetComboGeneral', body, {
      headers: this.headers,
    });
  }

  public GetComboCodDiagnostico(term:string): Observable<ClaimCodDiagnosticoResponse[]> {
    let data = new ClaimCodDiagnosticoRequest();
    data.P_SCAUSASIN = term;
    const body = JSON.stringify(data);
    return this.http.post<ClaimCodDiagnosticoResponse[]>(this.Url + '/Reserve/GetComboCodDiagnostico', body, {
      headers: this.headers,
    });
  }

  public GetComboComplejidadDiagnostico(): Observable<ClaimComboResponse[]> {
    const body = JSON.stringify({});
    return this.http.post<ClaimComboResponse[]>(this.Url + '/Reserve/GetComboComplejidadDiagnostico', body, {
      headers: this.headers,
    });
  }

  public GetComboTipoAtencion(): Observable<ClaimComboResponse[]> {
    const body = JSON.stringify({});
    return this.http.post<ClaimComboResponse[]>(this.Url + '/Reserve/GetComboTipoAtencion', body, {
      headers: this.headers,
    });
  }

  public GetComboTipoComprobante(): Observable<ClaimComboResponse[]> {
    const body = JSON.stringify({});
    return this.http.post<ClaimComboResponse[]>(this.Url + '/Reserve/GetComboTipoComprobante', body, {
      headers: this.headers,
    });
  }

  public GetComboBeneficiarios(): Observable<ClaimBeneficiarioModelRequestBM> {
    const body = JSON.stringify({});
    return this.http.post<ClaimBeneficiarioModelRequestBM>(this.Url + '/Reserve/GetComboBeneficiarios', body, {
      headers: this.headers,
    });
  }

  public GetClaimCaseData(data: ClaimCaseDataRequest): Observable<ClaimCoverResponse> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimCoverResponse>(this.Url + '/Reserve/GetClaimCaseData', body, {
      headers: this.headers,
    });
  }

}
