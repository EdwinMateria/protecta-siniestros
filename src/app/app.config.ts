import { environment } from "src/environments/environment";

export class AppConfig{

    public static get URL_API_SINIESTROS(): string {
        return environment.siniestroAPI;
    }
    public static get URL_SINIESTROS_WEB() : string {
        //return 'http://190.216.170.173/siniestrodes' //DESARROLLO
        return 'http://190.216.170.173/siniestroqa' //QA
        //return 'http://localhost:55556';
    }
}