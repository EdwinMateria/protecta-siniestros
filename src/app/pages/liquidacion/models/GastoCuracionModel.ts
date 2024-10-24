export class Movimiento{
    NCLAIM : string;
    NCOVER : number;
    DESC_COBERTURA : string;
    PENDIENTES : number;
    PAGOS_PEND_BENEF : number;
    DATO_ADICIONAL : string;
    SELECCION : boolean;
    ID: number;
    NCASENUM: string;
    DOCCURDAT: string;
    NROBENEF: number;
  }
  
  export class Detalle{
    NCODERROR : string;
    SMESSAGEERROR : string;
    SSTACLAIM : string;
    ESTADO_SINIESTRO : string;
    NPOLICY : string;
    DOCCURDAT: string;
    HORAOCURRENCIA:string;
    SCLIENAME:string;
    UIT: string;
    NLOC_RESERV: number;
  
  }
  
  export class PendientePago{
    NCLAIM : string;
    NCASE: string;
  }


  //MODAL GASTOS CURACION

  export class DatosSiniestro{
    PNCLAIM : string;
    PNCOVER : number;
    PNCASE: string;
  }
  
  export class DatosBeneficiarios{
    PNCLAIM : string;
    PNCOVER : number;
    PCASENUM: string;
    //PDOCCURDATE: Date;
    PPOLICY: string;
  }
  
  export class TipoPago{
    NOPER_TYPE : number;
    SSHORT_DES : string;
  }
  
  export class FormaPago{
    NPAY_FORM : number;
    SDESCRIPT : string;
  }
  
  export class DatosPago{
    NCLAIM : string;
    NCOVER : number;
    NCASE_NUM: string;
    NPOLICY: string;
    FECHAAPERTURA: string;
    FECHADECLARACION: string;
    SCLIENT: string;
    SCLIENAME: string;
    SESPECIALIDAD: string;
    SCODIGODIAGNOSTICO: string;
    FECHAEMISIONFACTURA: string;
    FECHARECEPCIONFACTURA: string;
    NBILL: string;
    NBANKEXT: string;
    DOCCURDAT: string;
    NOMBRE_BANCO: string;
    SACCOUNT: string;
    DESC_COBERTURA: string;
    IGV: string;
    SREGIST: string;
    NAMOUNT: number;
  }
  
  export class SalidaBeneficiarios{
    NCLAIM : string;
    NCASE_NUM : number;
    DOCUMENTO : string;  
    SSHORT_DES: string;
    SCLIENAME: number;
    //NPARTICIP: number;
    //UIT: number;
    //NCAPITAL: number;
    NBANKEXT: string;
    NOMBRE_BANCO: string;
    SACCOUNT: string;
    MONTO_PAGO: number; 
    MONTO_PAGO2: number;
    DIAGNOSTICO : string;
    ESPECIALIDAD : string;
    CANT_FACTURAS : number;
    SCLIENT: string;
    NAMOUNT: number;
    REEMBOLSO: number;
    //NBILL: string;
    //IGV: number;
    //TOTAL_COMP: number;
  }
  
  export class SalidaBeneficiariosMuerte{
    FILA : number;
    NCLAIM : string;
    NCASE_NUM : number;
    DOCUMENTO : string;  
    SSHORT_DES: string;
    SCLIENAME: number;
    //NPARTICIP: number;
    //UIT: number;
    //NCAPITAL: number;
    NBANKEXT: string;
    NOMBRE_BANCO: string;
    SACCOUNT: string;
    MONTO_PAGO: number;
    DIAGNOSTICO : string;
    ESPECIALIDAD : string;
    CANT_FACTURAS : number;
    SCLIENT: string;
    NAMOUNT: number;
    SELECT : boolean;
    m_tipopago:string;
    m_formapago:string;
    Observaciones: string;
  
    MONTO_PAGO2: number;
    REEMBOLSO: number;
    //NBILL: string;
    //IGV: number;
    //TOTAL_COMP: number;
  }
  
  export class FiltroList_Fact{
    PNCLAIM: number;
    PCASENUM: number;
    PNCOVER: number;  
    PSCLIENT : string;
  }
  
  export class SalidaFacturas {
    NUM_FACTURA: string;
    FECHAEMISIONFACTURA: string;
    FECHARECEPCIONFACTURA: string;
    BASE_IMPONIBLE:number;
    IGV:number;
    TOTAL_COMP:number;
    TOTAL_PAGAR_FAC:number;
  }
  
  export class FiltroProcesoPago{
    P_NCLAIM : number;
    P_NCASE : number;
    //P_NBRANCH : number;
    //P_NPRODUCT : number;
    P_NPOLICY : number;
    P_NCOVER : number;
    //P_NMODULEC : number;
    //P_NCURRENCY  : number;       
    P_SCLIENT : string;
    P_NUMFACT : string;
    P_FEC_EMISION_FAC :string;
    P_FEC_RECEP_FAC : string;
    P_DFINANALISIS : string;
    P_NOPER_TYPE : number;
    P_NPAY_FORM : number;
    P_NBANKEXT : string;
    P_SACCOUNT : string;
    P_NAMOUNT : number;
    P_OBSERVACIONES : string;
    P_NUSERCODE : number;
    P_COD_DIAG: string;
    P_ESPECIALIDAD: string;
  }
  
  export class FiltroProcesoPagoEnvio{
    P_NCLAIM : number;
    P_NCASE : number;
    //P_NBRANCH : number;
    //P_NPRODUCT : number;
    P_NPOLICY : number;
    P_NCOVER : number;
    //P_NMODULEC : number;
    //P_NCURRENCY  : number;       
    P_SCLIENT : string;
    P_NUMFACT : string;
    P_FEC_EMISION_FAC :string;
    P_FEC_RECEP_FAC : string;
    P_DFINANALISIS : string;
    P_NOPER_TYPE : number;
    P_NPAY_FORM : number;
    P_NBANKEXT : string;
    P_SACCOUNT : string;
    P_NAMOUNT : number;
    P_OBSERVACIONES : string;
    P_NUSERCODE : number;
    P_COD_DIAG: string;
    P_ESPECIALIDAD: string;
  }
  export class FiltroValidar{
    P_NCLAIM : number;
    P_NCASE : number;
    P_NCOVER : number;     
    P_SCLIENT : string;
    P_REEMBOLSO: number;
    P_NUMFACT : string;
    P_NOPER_TYPE : number;
    P_NAMOUNT : number;
  }
  export class salidaProcesoPago{
    NTRANSAC : number;
    SORDER_NUM : number;
    NCLAIM : number;
    NCASE_NUM : number;     
    NOPER_TYPE : number;
    NUSERCODE : number;
    STATUS : string;
    MENSAJE : string;
  }
  
  export class Campospago_validar{
   vsclient: string;
   //vtipoclient: string; 
   vfactura : string;
   vfinanalisis : string; 
   vbanco: string; 
   vnroCuenta : string;         
   vTipoPago : number;
   vFormaPago :number;
   vPendPagarCob : number;
   vpendpagofac : number;
   vPendPagoClient: number;
   vMontoPago: number;
   vObserv : string;
   vReembolso: number;
  }

  export class FiltroCaso{    
    PCASENUM : number;
}

 export class Lista_Siniestros{    
    NCODIGO : number;
    SDESCRIPT : string;
 } 