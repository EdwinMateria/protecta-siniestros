import { environment } from "src/environments/environment";

export class AppConfig{
    public static get URL_API_SOAT_RESERVA(): string {
        return environment.reservaApi;
    }

    public static get URL_API_SINIESTROS(): string {
        return environment.siniestroAPI;
    }
}