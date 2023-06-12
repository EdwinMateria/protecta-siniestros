export class ClaimBenefParamResponse {
    ListBeneficiaries   : BeneficiariesVM[];
}

export class BeneficiariesVM {
    SNAME               : string;
    SCODE               : string;
    SCODEATTORNEY       : string;
    NTYPE               : number;
    NRELATIONSHIP       : number;
    NAGE                : number;
    NVALID              : number;
    SDOCUMENTTYPE       : string;
    SDOCUMENTNUMBER     : string;
    SBENEFICIARYTYPE    : string;
    SCOVER_DESC         : string;
    SBANK               : string;
    SACCOUNTNUMBER      : string;
    SCODDOCUMENTTYPE    : string;
    SCODBENEFICIARYTYPE : string;
}