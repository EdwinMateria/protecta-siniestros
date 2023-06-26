// import { Injectable } from "@angular/core";
// import { AppConfig } from "../app.config";
// import { Headers, Http, } from "@angular/http";
// import { DatosCasoSiniestro } from "../pages/liquidacion/models/Liquidacion.model";

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { DatosCasoSiniestro } from '../pages/liquidacion/models/Liquidacion.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';



@Injectable({ providedIn: 'root' })

export class LiquidacionService {

    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SOAT;

    constructor(private http: HttpClient) { }

    //Retorna los datos del siniestro
    public RetornarDatosCasoSiniestro(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post(this.Url + '/LiquidacionManager/RetornarDatosCasoSiniestro', data, { headers: this.headers });
    }

    //Retorna la lista de tipos de pago
    // public GetListaTipoPago(idata: any): Observable<any> {
    //     const data = JSON.stringify(idata);
    //     return this.http.post(this.Url + '/LiquidacionManager/GetListaTipoPago', data, { headers: this.headers });
    // }

    GetListaTipoPago(): Observable<any> {
        const url = `${this.Url}/LiquidacionManager/GetListaTipoPago`;
        const payload = {
          NOPER_TYPE: 0,
          SSHORT_DES: '',
        };
        return this.http.post(url, { data: btoa(JSON.stringify(payload)) }).pipe(
          map((response: any) =>
            response.map((value: any) => ({
              id: +value.NOPER_TYPE,
              description: (<string>value.SSHORT_DES)
                .toString()
                .trim()
                .toUpperCase(),
            }))
          )
        );
      }

    //Retorna la lista de formas de pago
    // public GetListaFormaPago(idata: any): Observable<any> {
    //     const data = JSON.stringify(idata);
    //     return this.http.post(this.Url + '/LiquidacionManager/GetListaFormaPago', data, { headers: this.headers });
    // }

    GetListaFormaPago(): Observable<any> {
        const url = `${this.Url}/LiquidacionManager/GetListaFormaPago`;
        const payload = {
          NOPER_TYPE: 0,
          SSHORT_DES: '',
        };
        return this.http.post(url, { data: btoa(JSON.stringify(payload)) }).pipe(
          map((response: any) =>
            response.map((value: any) => ({
              id: +value.NPAY_FORM,
              description: (<string>value.SDESCRIPT)
                .toString()
                .trim()
                .toUpperCase(),
            }))
          )
        );
      }

    //Retorna la lista de siniestros pendientes de pago
    public RetornarListaSiniPendPago(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post(this.Url + '/LiquidacionManager/RetornarListaSiniPendPago', data, { headers: this.headers });
    }

    //Retorna los datos de los gastos de las coberturas
    public ObtenerDatosGastosSepMed(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post(this.Url + '/LiquidacionManager/ObtenerDatosGastosSepMed', data, { headers: this.headers });
    }

    //Retorna la lista con los beneficiarios por cobertura
    public ObtenerBeneficiariosMuerte(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post(this.Url + '/LiquidacionManager/ObtenerBeneficiariosMuerte', data, { headers: this.headers });
    }

    //Procesa el pago de la liquidacion
    public InsertarLiquidacionSoat(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post(this.Url + '/LiquidacionManager/InsertarLiquidacionSoat', data, { headers: this.headers });
    }

    //Inicio Reporte Historico
    //Retorna reporte de siniestros historicos
    public ReporteHistoricoSoatSiniestro(idata: any): Observable<any> {
      const data = JSON.stringify(idata);
      return this.http.post(this.Url + '/LiquidacionManager/ReporteHistoricoSiniestros', data, { headers: this.headers });
    }
    //Retorna reporte de reserva historicos
    public ReporteHistoricoSoatReserva(idata: any): Observable<any> {
      const data = JSON.stringify(idata);
      return this.http.post(this.Url + '/LiquidacionManager/ReporteHistoricoReservas', data, { headers: this.headers });
    }
    //Retorna reporte de liquidaciones historicos
    public ReporteHistoricoSoatLiquidaciones(idata: any): Observable<any> {
      const data = JSON.stringify(idata);
      return this.http.post(this.Url + '/LiquidacionManager/ReporteHistoricoLiquidaciones', data, { headers: this.headers });
    }
    //prueba
    // public GenerarExcelSiniestros(idata: any): Observable<any>{
    //   //const Json = { "idReport": idReport };
    //   const data = JSON.stringify(idata);
    //   return this.http.post(this.Url + '/LiquidacionManager/GenerarExcelSiniestros', data,{ headers: this.headers });
    // }

    public GenerarExcelSiniestros(idata: any, nomSiniestros: string) {
      const parametros = new HttpParams()
            .set('P_DFECINI', idata.P_DFECINI)
            .set('P_DFECFIN', idata.P_DFECFIN)
      this.http.get(this.Url + '/LiquidacionManager/GenerarExcelSiniestros', { params: parametros, responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = nomSiniestros + '.xlsx'; //'ReporteHistoricoSOAT_Siniestro.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    }

    public GenerarExcelReservas(idata: any, nomSiniestros: string) {
      const parametros = new HttpParams()
            .set('P_DFECINI', idata.P_DFECINI)
            .set('P_DFECFIN', idata.P_DFECFIN)
      this.http.get(this.Url + '/LiquidacionManager/GenerarExcelReservas', { params: parametros, responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = nomSiniestros + '.xlsx'; //'ReporteHistoricoSOAT_Reservas.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    }

    public GenerarExcelLiquidaciones(idata: any, nomSiniestros: string) {
      const parametros = new HttpParams()
            .set('P_DFECINI', idata.P_DFECINI)
            .set('P_DFECFIN', idata.P_DFECFIN)
      this.http.get(this.Url + '/LiquidacionManager/GenerarExcelLiquidaciones', { params: parametros, responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = nomSiniestros + '.xlsx'; //'ReporteHistoricoSOAT_Liquidaciones.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    }

    public GenerarExcelHistoricoTodo(idata: any, nomSiniestros: string) {
      const parametros = new HttpParams()
            .set('P_DFECINI', idata.P_DFECINI)
            .set('P_DFECFIN', idata.P_DFECFIN)
      this.http.get(this.Url + '/LiquidacionManager/GenerarExcelHistoricoTodo', { params: parametros, responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = nomSiniestros + '.xlsx'; //'ReporteHistoricoSOAT_Liquidaciones.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    }
    //Fin Reporte Historico

}