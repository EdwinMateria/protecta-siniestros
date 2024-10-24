import { ClaimBenefCuentasModelRequesBM } from "./benefCuentaResponse";

export class ClaimComboBERequestBM{
    Codigo      :   string;
    Descripcion :   string;
}


export class ClaimBeneficiarioModelRequestBM {
    SCLIENT_ANT         :   string;
    Accion              :   string;
    TipoDocumento       :   string;
    SCLIENT             :   string;
    NroDocumento        :   string;
    ApellidoPaterno     :   string;
    ApellidoMaterno     :   string;
    Nombres             :   string;
    RazonSocial         :   string;
    FechaNacimiento     :   string;
    Sexo                :   string;
    EstadoCivil         :   string;
    Nacionalidad        :   string;
    Via                 :   string;
    Lote                :   string;
    Piso                :   string;
    Apartamento         :   string;
    Ubicacion           :   string;
    Departamento        :   string;
    Provincia           :   string;
    Distrito            :   string;
    TeleDom             :   string;
    Celular             :   string;
    TeleOfi             :   string;
    CodViaPago          :   string;
    CodTipoCuenta       :   string;
    CodBanco            :   string;
    NroCuenta           :   string;
    NroCuentaCCI        :   string;
    CodigoUsuario       :   string;
    CodTipoVia          :   string;
    CodBloque           :   string;
    CodTipoInt          :   string;
    CodConHab           :   string;
    CodArea             :   string;
    Direccion           :   string;
    Nro                 :   string;
    Interior            :   string;
    Manzana             :   string;
    Etapa               :   string;
    NomConjHabit        :   string;
    NumLet              :   string;
    Referencia          :   string;
    Anexo               :   string;
    Correo              :   string;
    lstTipoDoc          :   ClaimComboBERequestBM[];
    lstSexo             :   ClaimComboBERequestBM[];
    lstEstadoCivil      :   ClaimComboBERequestBM[];
    lstNacionalidad     :   ClaimComboBERequestBM[];
    lstDepartamento     :   ClaimComboBERequestBM[];
    lstProvincia        :   ClaimComboBERequestBM[];
    lstDistrito         :   ClaimComboBERequestBM[];
    lstViaPago          :   ClaimComboBERequestBM[];
    lstTipoCuenta       :   ClaimComboBERequestBM[];
    lstBanco            :   ClaimComboBERequestBM[];
    lstTipoVia          :   ClaimComboBERequestBM[];
    lstBloque           :   ClaimComboBERequestBM[];
    lstTipoInt          :   ClaimComboBERequestBM[];
    lstConHab           :   ClaimComboBERequestBM[];
    lstArea             :   ClaimComboBERequestBM[];
    APIGestorClienteURL :   string;
    APIGestorClienteUser:   string;
    FechaFinPagoPension :   string;
    FechaFallecimientoPensionista: string;
    CondicionEstudiante :   string;
    Edad                :   number;
    PorcentajeBeneficiario: number;
    CtasBeneficiario    : ClaimBenefCuentasModelRequesBM[];
}