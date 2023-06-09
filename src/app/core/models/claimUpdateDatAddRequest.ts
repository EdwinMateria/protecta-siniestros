export class ClaimUpdateDatAddRequestBM {
	ListBeneficiariesMod    : BeneficiaresModVM[];
	NCLAIM                  : number;
	NCASE_NUM               : number;
	SESPECIALIDAD           : string;
	FECHARECEPCIONFACTURA   : string;
	SCODIGODIAGNOSTICO      : string;
	SRUCPROVEEDOR           : string;
	SNOMBREPROVEEDOR        : string;
	SRED_IPRESS             : string;
	FECHAEMISIONFACTURA     : string;
	STIPOATENCION           : string;
	NTRANSAC                : number;
	NCOVER                  : number;
	SLOCATED                : string;
	SCOMPLEXITY             : string;
	SORDER_NUM              : string;
	NAMOUNT_LETTER          : number;
	SNOMBREDOCTOR           : string;
	SPROCESSOR              : string;
	SPROCESSOR_NAME         : string;
	SPROCESSOR_AREA         : string;
	NIMPAIRMENT             : number;
	NRMV                    : number;
	FINIDESCANSO            : string;
	FFINDESCANSO            : string;
	SDERIVATIONINR          : string;
	FDERIVATION             : string;
	FANSWER                 : string;
	SPROCEEDING             : string;
	NDOC_TYPE               : number;
	SBILL                   : string;
	NAMOUNT                 : number;
	SAFFECTS_IGV            : string;
	SIPRESS_AT              : string;
	SREFUND                 : string;
	NUSERCODE               : number;
	SDOCUMENTTYPE           : string;

	constructor(){
		this.ListBeneficiariesMod = [];
	}
}

export class BeneficiaresModVM {
	SCLIENT                 : string;
	SCLIENTNAME             : string;
	NTYPCLIENTDOC           : number;
	SDESCRIPTYPCLIENTDOC    : string;
	SDOCUMENTNUMBER         : string;
	NCODBENEFICIARYTYPE     : number;
	SBENEFICIARYTYPE        : string;
	NBANK_CODE              : string;
	SACCOUNT                : string;
	NUSERCODE               : number;
	NCLAIM                  : number;
	NCASE_NUM               : number;
	NCOVER                  : number;
}