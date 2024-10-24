import { environment } from "src/environments/environment";

export class AppConfig{

    public static get URL_API_SINIESTROS(): string {
        return environment.siniestroAPI;
    }
    public static get URL_SINIESTROS_WEB() : string {
        //return 'http://190.216.170.173/siniestrodes' //DESARROLLO
        //return 'http://190.216.170.173/siniestroqa' //QA
        //return 'http://172.23.10.23/siniestroqa' //QA
        //return 'http://localhost:55556';
        return 'https://apps.protectasecurity.pe/Siniestros' //PRODUCCION
    }
}