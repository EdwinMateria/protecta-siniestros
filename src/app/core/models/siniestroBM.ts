import { CausasVM } from "./caso";

export class SiniestroBM {
    nPolicy             : string;
    nCertif             : string;
    nCaso               : number;
    nSiniestro          : number;
    sCliente            : string;
    nCodRechazo         : number;
    nCausaSiniestro     : number;
    lista_CausaSiniestro: CausasVM[];
    nMoneda             : number;
    sHoraOcurrencia     : string;
    dFecOcurrencia      : string;
    dFecRechazo         : string | null;
    dFecDenuncia        : string;
    sHoraRecepcion      : string;
    dFecApertura        : string;
    nTipOcupante        : number;
    sTipOcupante        : string;
    sTipAtencion        : string;
    dFecFallecido       : string;
    sEquivSiniestro     : string;
    nCodUsuario         : number;
    sMesaje             : string;
    sCodClie            : string;
    dFecReapertura      : string;
    
}