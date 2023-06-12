export class ClaimDataCoverVM{
    SDESCOVER       :   string;
    NCOVER          :   number;
    NDAMAGES        :   number;
    SCLIENT         :   string;
    SCURRDES        :   string;
    SCLIENAME       :   string;
    NSUMINSURED     :   number;
    NACCUMRESERVE   :   number;
    NMODULEC        :   number;
    NCURRENCY       :   number
}

export class ClaimCoverResponse{
    NPOLICY         :   number;
    NCERTIF         :   number;
    SCLIENAME       :   string;
    DOCCURDAT       :   string;
    HORAOCURRENCIA  :   string;
    UIT             :   number;
    STIPOATENCION   :   string;
    SCERTYPE        :   string;
    NBRANCH         :   string;
    NPRODUCT        :   string;
    SBRANCHT        :   string;
    NCLAIM          :   string;
    NCASE_NUM       :   string;
    NDEMAN_TYPE     :   string;
    NOPT_CLAITYP    :   string;
    SKEY            :   string;
    LISTA_COVERCLAIM:   ClaimDataCoverVM[]   
}