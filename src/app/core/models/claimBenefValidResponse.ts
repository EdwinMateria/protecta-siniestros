import { BeneficiariesVM } from "./claimBenefParamResponse";

export class ClaimBenefValidResponseVM {
	ListBeneficiariesValid  : BeneficiariesVM[];
	SRESULT                 : string;
}

export class BeneficiariesValidVM {
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
	NCODBENEFICIARYTYPE : number;
	NCODDOCUMENTTYPE    : number;
}