export class ClaimValRegisterRequestBM{
    LIST_PARAM_RESERVE : ClaimValRegisterBM[]

    constructor(){
        this.LIST_PARAM_RESERVE = []
    }
}

export class ClaimValRegisterBM {
	SKEY            : string;
	SMOVETYPE       : string;
	NCASE_NUM       : number;
	NCLAIM          : number;
	NCOVER          : number;
	NRESERVEAMOUNT  : number;
	NSUMASSURED     : number;
	NPOLICY         : number;
	NCERTIF         : number;
	NMODULEC        : number;
	NCURRENCY       : number;
	NUSERCODE       : number;
	DOCCURDAT       : string;
	SCLIENT         : string;
}