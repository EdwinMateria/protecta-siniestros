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
import { ClaimCoverResponse, ClaimDataCoverVM } from '../../models/claimCoverResponse';
import { ClaimBenefParamRequest } from '../../models/claimBenefParamRequest';
import { ClaimBenefParamResponse } from '../../models/claimBenefParamResponse';
import { ClaimBeneficiarioRequest } from '../../models/claimBeneficiarioRequest';
import { Data } from '@angular/router';
import { ClaimCoverTmpRequestBM } from '../../models/claimCoverTmpRequest';
import { ClaimsCoversReserveRequest } from '../../models/claimsCoversReserveRequest';
import { ClaimsCoversReserveResponse } from '../../models/claimsCoversReserveResponse';
import { ClaimRmvResponse } from '../../models/claimRmvResponse';
import { ClaimRmvRequest } from '../../models/claimRmvRequest';
import { ClaimCoverTmpResponseBM } from '../../models/claimCoverTmpResponse';
import { ClaimValRegisterRequestBM } from '../../models/claimValRegisterRequest';
import { ClaimValRegisterResponseVM } from '../../models/claimValRegisterResponse';
import { ClaimValCoverRequest, ClaimValCoverResponse } from '../../models/claimValCoverRequest';
import { ClaimGetDatAddResponseVM } from '../../models/claimGetDatAddResponse';
import { ClaimDeleteBenefRequest } from '../../models/claimDeleteBenefReques';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

   private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   private Url = AppConfig.URL_API_SOAT_RESERVA;

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

  public BusquedaBeneficiario(data: ClaimBenefParamRequest): Observable<ClaimBenefParamResponse> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimBenefParamResponse>(this.Url + '/Reserve/GetBeneficiariesCover', body, {
      headers: this.headers,
    });
  }

  public GetBeneficiariesAdditionalDataCover(data: ClaimBeneficiarioRequest): Observable<ClaimBenefParamResponse> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimBenefParamResponse>(this.Url + '/Reserve/GetBeneficiariesAdditionalDataCover', body, {
      headers: this.headers,
    });
  }

  public GetComboBanco(): Observable<ClaimComboResponse[]> {
    const body = JSON.stringify({});
    return this.http.post<ClaimComboResponse[]>(this.Url + '/Reserve/GetComboBanco', body, {
      headers: this.headers,
    });
  }

  public SaveApi(data: Data): Observable<any> {
    //const body = JSON.stringify(data);
    return this.http.post<any>(this.Url + '/Reserve/SaveApi', data, {
      headers: this.headers,
    });
  }

  public GetDatCoversTmp(data: ClaimsCoversReserveRequest): Observable<ClaimsCoversReserveResponse> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimsCoversReserveResponse>(this.Url + '/Reserve/GetDatCoversTmp', body, {
      headers: this.headers,
    });
  }

  public GetRmv(data: ClaimRmvRequest): Observable<ClaimRmvResponse[]> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimRmvResponse[]>(this.Url + '/Reserve/GetRmv', body, {
      headers: this.headers,
    });
  }

  public InsertDatCoversTmp(data: ClaimCoverTmpRequestBM): Observable<ClaimCoverTmpResponseBM> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimCoverTmpResponseBM>(this.Url + '/Reserve/InsertDatCoversTmp', body, {
      headers: this.headers,
    });
  }

  public DeleteCoverTmp(data: ClaimCoverTmpRequestBM): Observable<string> {
    const body = JSON.stringify(data);
    return this.http.post<string>(this.Url + '/Reserve/DeleteCoverTmp', body, {
      headers: this.headers,
    });
  }

  public ValidRegisterCoverData(data: ClaimValRegisterRequestBM): Observable<ClaimValRegisterResponseVM> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimValRegisterResponseVM>(this.Url + '/Reserve/ValidRegisterCoverData', body, {
      headers: this.headers,
    });
  }

  public ValidCoverReserve(data: ClaimValCoverRequest): Observable<ClaimValCoverResponse> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimValCoverResponse>(this.Url + '/Reserve/ValidCoverReserve', body, {
      headers: this.headers,
    });
  }

  public GetDataAddBenefCover(data: ClaimValCoverRequest): Observable<ClaimGetDatAddResponseVM> {
    const body = JSON.stringify(data);
    return this.http.post<ClaimGetDatAddResponseVM>(this.Url + '/Reserve/GetDataAddBenefCover', body, {
      headers: this.headers,
    });
  }

  public DeleteBenefCover(data: ClaimDeleteBenefRequest): Observable<string> {
    const body = JSON.stringify(data);
    return this.http.post<string>(this.Url + '/Reserve/DeleteBenefCover', body, {
      headers: this.headers,
    });
  }

}
