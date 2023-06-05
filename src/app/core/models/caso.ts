export class CasosBM {
    nCaso                   : number;
    nBranch                 : number;
    nPolicy                 : string;
    nCertif                 : number;
    nProduct                : number;
    dFecOcurrencia          : string;
    sHoraOcurrencia         : string;
    dAnulacion              : string;
    sNroPlaca               : string;
    nCulpabilidad           : number;
    dIniVigencia            : Date;
    dFinVigencia            : Date;
    nCausaSiniestro         : number;
    sUbicacion              : string;
    sReferencia             : string;
    nDepartamento           : number;
    nProvincia              : number;
    nDistrito               : number;
    nDelegacion             : number;
    sNombreConductor        : string;
    sPaternoConductor       : string;
    sMaternoConductor       : string;
    nTipDocConductor        : string;
    sDocConductor           : string;
    dFecNacConductor        : string;
    sNombreContratante      : string;
    sDocContratante         : string;
    sDelegacion             : string;
    sTipoOcupante           : string;
    sTipoAtencion           : string;
    sObservacion            : string;
    Lista_Culpabilidad      : CulpabilidadVM[];
    Lista_CausaSiniestro    : CausasVM[];
    Lista_TipDocConductor   : CombosGenericoVM[];
    Lista_Departamento      : CombosGenericoVM[];
    Lista_Provincia         : CombosGenericoVM[];
    Lista_Distrito          : CombosGenericoVM[];

    constructor(){
        this.Lista_CausaSiniestro = [];
        this.Lista_Culpabilidad = [];
        this.Lista_TipDocConductor = [];
        this.Lista_Departamento = [];
        this.Lista_Provincia = [];
        this.Lista_Distrito = [];
    }
}

export class CulpabilidadVM {
    nBlame                  : string;
    sDescript               : string;
}

export class CausasVM {
    nCodCausa               : string;
    sDescript               : string;
}

export class CombosGenericoVM {
    codigo                  : number;
    descripcion             : string;
}