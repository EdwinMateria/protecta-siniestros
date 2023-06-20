import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';

@Injectable({ providedIn: 'root' })

export class CargaMasivaService {

    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SINIESTROS;

    constructor(private http: HttpClient) { }

    public RecorrerListaApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/Siniestros/RecorrerListaApertura', data, { headers: this.headers });
    };

    public ListarErroresApertura(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/Siniestros/ListarErroresApertura', data, { headers: this.headers });
    };

    public GenerarReportePreliminar(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/Siniestros/GenerarReportePreliminar', data, { headers: this.headers });
    };

    public ListarCabeceraData(idata: any): Observable<any> {
        const data = JSON.stringify(idata);
        return this.http.post<any[]>(this.Url + '/Siniestros/ListarCabeceraData', data, { headers: this.headers });
    };
}