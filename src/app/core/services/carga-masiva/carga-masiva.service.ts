import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';

@Injectable({ providedIn: 'root' })

export class CargaMasivaService {

    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SINIESTROS;

    constructor(private http: HttpClient) { }

    // Cabecera
    public ListarCabeceraData(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ListarCabeceraData', data, { headers: this.headers });
    };

    // Reporte Preliminar
    public ProcessReportePreliminarApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ProcessReportePreliminarApertura', data, { headers: this.headers });
    };
    public ProcessReportePreliminarReservas(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ProcessReportePreliminarReservas', data, { headers: this.headers });
    };
    public ProcessReportePreliminarLiquidacion(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ProcessReportePreliminarLiquidacion', data, { headers: this.headers });
    };

    // Errores
    public ListarErroresApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ListarErroresApertura', data, { headers: this.headers });
    };
    public ListarErroresReservas(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ListarErroresReservas', data, { headers: this.headers });
    };
    public ListarErroresLiquidacion(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/ListarErroresLiquidacion', data, { headers: this.headers });
    };

    // Cargar Preliminar
    public RecorrerListaApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/RecorrerListaApertura', data, { headers: this.headers });
    };
    public RecorrerListaReservas(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/RecorrerListaReservas', data, { headers: this.headers });
    };
    public RecorrerListaLiquidacion(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/RecorrerListaLiquidacion', data, { headers: this.headers });
    };

    // Cargar Definitivo
    public CargarDefinitivoApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/CargarDefinitivoApertura', data, { headers: this.headers });
    };
    public CargarDefinitivoReservas(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/CargarDefinitivoReservas', data, { headers: this.headers });
    };
    public CargarDefinitivoLiquidacion(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/CargaMasiva/CargarDefinitivoLiquidacion', data, { headers: this.headers });
    };
}