import { environment } from "src/environments/environment";

export class AppConfig{
    public static get URL_API_SOAT(): string {
        return environment.kunturapi;
    }
}