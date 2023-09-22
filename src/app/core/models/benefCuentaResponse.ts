export class ClaimBenefCuentasModelRequesBM {
    nidacc          : number;
    SCLIENT         : string;
    CodTipoCuenta   : string;
    TipoCuenta      : string;
    CodBanco        : string;
    Banco           : string;
    NroCuenta       : string;
    NroCuentaCCI    : string;
    SMoneda         : string;
    MonedaCod       : string;
    Insupd          : string;
    ViaPago         : string;
    Modifica        : string;
    Habilita        : string;
    length          ?: number;
    Posicion        ?: number;
    CodViaPago      ?: string;
    constructor(){
        this.CodBanco = "";
        this.CodTipoCuenta = "0";
        this.MonedaCod = "0";
        this.Habilita = "1";
    }
}