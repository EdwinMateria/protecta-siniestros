export class Data {
    P_SKEYADDRESS           ?: string;
    P_CodAplicacion         : string;
    P_TipOper               : string;
    P_NUSERCODE             : string;
    P_NIDDOC_TYPE           : string;
    P_SIDDOC                : string;
    P_SFIRSTNAME            : string;
    P_SLASTNAME             : string;
    P_SLASTNAME2            : string;
    P_SLEGALNAME            : string;
    P_SSEXCLIEN             : string;
    P_DBIRTHDAT             : string;
    P_NSPECIALITY           : string;
    P_NCIVILSTA             : string;
    P_NTITLE                : string;
    P_NNATIONALITY          : string;
    P_SISCLIENT_IND         : string;
    P_SISRENIEC_IND         : string;
    EListAddresClient       : Direccion[];
    EListPhoneClient        : Telefono[];
    EListEmailClient        : Correo[];
    EListContactClient      : any[];
}

export class Direccion {
    P_SRECTYPE              : string;
    P_NCOUNTRY              : string;
    P_NPROVINCE             : string;
    P_NLOCAL                : string;
    P_NMUNICIPALITY         : string;
    P_STI_DIRE              : string;
    P_SNOM_DIRECCION        : string;
    P_SNUM_DIRECCION        : string;
    P_STI_BLOCKCHALET       : string;
    P_SBLOCKCHALET          : string;
    P_STI_INTERIOR          : string;
    P_SNUM_INTERIOR         : string;
    P_STI_CJHT              : string;
    P_SNOM_CJHT             : string;
    P_SETAPA                : string;
    P_SMANZANA              : string;
    P_SLOTE                 : string;
    P_SREFERENCIA           : string;
    P_TipOper               : string;
    P_SKEYADDRESS           : string;
}

export class Telefono {
    P_NRECOWNER             ?: string;
    P_NKEYPHONES            ?: string;
    P_DEFFECDATE            ?: string;
    P_NBESTTIMETOCALL       ?: string;
    P_NAREA_CODE            ?: string;
    P_SPHONE                : string;
    P_NORDER                ?: string;
    P_NEXTENS1              ?: string;
    P_NEXTENS2              ?: string;
    P_NPHONE_TYPE           : string;
    P_NCOUNTRY_CODE         ?: string;
    P_SASSOCADDR            ?: string;
    P_DCOMPDATE             ?: string;
    P_NUSERCODE             ?: string;
    P_DESTIPOTLF            ?: string;
    P_DESAREA               ?: string;
    P_SNOMUSUARIO           ?: string;
    P_SKEYADDRESS           ?: string;
    P_TipOper               ?: string;
}

export class Correo {
    P_NRECOWNER             ?: string;
    P_SRECTYPE              : string;
    P_DEFFECDATE            ?: string;
    P_SE_MAIL               : string;
    P_DCOMPDATE             ?: string;
    P_NUSERCODE             ?: string;
    P_DESTICORREO           ?: string;
    P_SNOMUSUARIO           ?: string;
    P_SKEYADDRESS           ?: string;
    P_SINFOR                ?: string;
    P_TipOper               ?: string;
}