export class ClaimCoverTmpRequestBM {
    SKEY                    : string;
    NCASE                   : number;
    NCLAIM                  : number;
    NCOVER                  : number;
    NAMOUNT                 : number;
    SLOCATED                : string;
    DFECFINANA              : string;
    LIST_BENEF_COVERS       : ClaimsBenefCoverVM[];
    SDIAGNOSTICCODE         : string;
    SDIAGNOSTIC             : string;
    SPROCESSOR              : string;
    SPROCESSORNAME          : string;
    SPROCESSORZONE          : string;
    SSPECIALTY              : string;
    SDIAGNOSTICCOMPLEXITY   : string;
    SATTENDINGMEDIC         : string;
    SATENTIONIPRESS         : string;
    DRESTSTART              : string;
    DRESTEND                : string;
    NMINIMUNREMUNERATION    : number;
    NRESERVEAMOUNT          : number;
    NDAYSOFF                : number;
    SINR_REFERRAL           : string;
    SINR_FILENUMBER         : string;
    DINR_REFERRALDATE       : string;
    DINR_RESPONSEDATE       : string;
    NIMPAIRMENT             : number;
    STYPEATTENTION          : string;
    NTYPERECEIPT            : number;
    SVOUCHERNUMBER          : string;
    DDATEOFISSUE            : string;
    DDATERECEPTION          : string;
    SREFERENTIALNAMEIPRESS  : string;
    SRUC                    : string;
    SRED_IPRESS             : string;
    NAMOUNTBASE             : number;
    NIGV                    : number;
    NAMOUNTTOTAL            : number;
    SAFFECTIGV              : string;
    SNROLETTER              : string;
    NUITQUANTITY            : number;
    NUITAMOUNT              : number;
    SREFUND                 : string;
}

export class ClaimsBenefCoverVM {
    SCODCLI                 : string;
    SBENEFICIARY            : string;
    SDOCUMENTTYPE           : string;
    SDOCUMENTNUMBER         : string;
    SBENEFICIARYTYPE        : string;
    SCOVER_DESC             : string;
    SBANK                   : string;
    SACCOUNTNUMBER          : string;
}