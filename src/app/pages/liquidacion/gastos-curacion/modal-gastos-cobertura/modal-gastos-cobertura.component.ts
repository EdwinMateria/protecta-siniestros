import { Component, OnInit, Input } from '@angular/core';
//import { Detalle } from '../gastos-curacion.component';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async } from 'rxjs/internal/scheduler/async';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LiquidacionService } from 'src/app/core/services/liquidacion/liquidacion.service';
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import { SwalCarga } from 'src/app/core/swal-loading';
import { Movimiento } from '../../models/GastoCuracionModel';

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

@Component({
  selector: 'app-modal-gastos-cobertura',
  templateUrl: './modal-gastos-cobertura.component.html',
  styleUrls: ['./modal-gastos-cobertura.component.scss']
})
export class ModalGastosCoberturaComponent implements OnInit {

  caso = "0";
  siniestro = "0";
  poliza = "0";
  placa = "";
  docSiniestrado = "";
  siniestrado = ""; 
  fechaOcurrencia = "";
  fechaDenuncia = "";
  fechaApertura = "";
  codDiagnostico = "";
  txtDiagnostico = "";
  especialidad = "";
  tipoCobertura = 0;
  idBanco = "";
  banco = "";
  nroCuenta = "";
  nroFactura = "";
  fechaEmisionFac = "";
  fechaRecibeFac = "";
  tipoDocumento = "";  
  nroDocumento = "";
  reembolso   = 0;
  sfila = 1;
  @Input() public reference: any;
  @Input() public data: Movimiento[];
  //@Input() public datos_siniestro: Detalle[];
  @Input() public beneficiario: SalidaBeneficiarios[];
  titulo = "";
  baseImponible = 0;
  totalFactura = 0; 
  PendPagoClient = 0;
  pendpagofac = 0;  
  igv = 0;
  totalComprobante = 0;
  totalPagarMuerte = 0;
  pendientePago = 0;
  pendientePagoCob =0;
  cant_facturas = 0; 
  FechaFinAnalisis = "";
  txttipopago = "";
  txtformapago = "";  
  BtnDisabled1 = false;
  BtnDisabled2 = false;  
  messageMVal = "";
  CbonomBeneficiarios = "";
  //formfecha_analisis = new FormControl(null, [Validators.required]);
  formtipopago = new FormControl("0", [Validators.required, this.notAllowed(/^0/)]);
  formformapago = new FormControl("0", [Validators.required, this.notAllowed(/^0/)]);
  formimporte = new FormControl(0, [Validators.required, this.notAllowed(/^0/)]);
  
  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? {notAllowed: {value: control.value}} : null;
    };
  }

  constructor(private service: LiquidacionService,
              private modalService: NgbModal, public authProtectaService: AuthProtectaService) { }

  datosPago: DatosPago = new DatosPago;
  datosPagoSalida: DatosPago = new DatosPago;
  datosSiniestro: DatosSiniestro = new DatosSiniestro;
  datosBeneficiarios: DatosBeneficiarios = new DatosBeneficiarios;
  tipoPago: TipoPago[] = [];
  formaPago: FormaPago[] = [];
  salidaBeneficiarios: SalidaBeneficiarios[] = [];
  salidaBenef_Origen: SalidaBeneficiarios[] = [];
  objBeneficiario : SalidaBeneficiarios;
  fechaOcur = "";
  FiltroList_Fact : FiltroList_Fact[] = [];
  salidaFacturas : SalidaFacturas[] = [];
  salidaFact_Origen : SalidaFacturas[] = [];
  FiltroProcesoPago : FiltroProcesoPago[] =[];
  FiltroProcesoPagoEnvio : FiltroProcesoPagoEnvio[] =[];
  salidaProcesoPago : salidaProcesoPago;
  salidaValidaciones : salidaProcesoPago[] =[];
  Campospago_validar : Campospago_validar[] =[];
  mensaje : string;

 salidaBeneficiariosMuerte: SalidaBeneficiariosMuerte[] = [];
 FiltProcPagoMuerteEnvio : FiltroProcesoPagoEnvio[] =[];
 salidaProcPagoMuerte : salidaProcesoPago;

 FiltroValidar : FiltroValidar[] = [];

  ngOnInit(): void {
    this.inicializadorModal()
  }

  closeModal() {
    this.reference.close(false);
  }

  inicializadorModal(){

    //llenamos las listas
    this.GetListaTipoPago();
    this.GetListaFormaPago();

    //TITULO MODAL
    this.tipoCobertura = this.data[0].NCOVER;
    console.log(this.tipoCobertura);
    this.titulo = this.data[0].DESC_COBERTURA;

    this.siniestro = this.data[0].NCLAIM;
    this.caso = this.data[0].NCASENUM;

    this.datosSiniestro.PNCASE = this.caso;
    this.datosSiniestro.PNCLAIM = this.siniestro;
    this.datosSiniestro.PNCOVER = this.tipoCobertura;
    //this.tipoCobertura = 4;  //cobertura de prueba, borrar esta linea despues de probar
    //this.titulo = "GASTOS DE CURACION";

    this.buscarDatosPago(this.datosSiniestro);
    //this.baseImponible = this.redondearDecimales(this.data[0].PENDIENTES,2);
    
    //limpiar datos beneficiarios
    
    this.salidaBeneficiarios = [];
    this.salidaBenef_Origen = [];
    this.salidaBeneficiariosMuerte = [];
    this.Clear_Inputs();

    //SUMA TOTAL
    if(this.tipoCobertura == 4 || this.tipoCobertura == 5){ // Gastos Medicos ó Gastos de Sepelio
      //Obtenemos los beneficiarios
      this.datosBeneficiarios.PNCLAIM = this.siniestro;
      this.datosBeneficiarios.PNCOVER = this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = this.caso;    
      this.datosBeneficiarios.PPOLICY = this.poliza;
      this.ObtenerBeneficiarios(this.datosBeneficiarios);  
      this.pendientePago = this.redondearDecimales(this.data[0].PAGOS_PEND_BENEF,2);
      //this.baseImponible = this.data.reduce(function (acc, obj) { return acc + obj.PENDIENTES; }, 0);
      //this.baseImponible = this.redondearDecimales(this.data[0].PENDIENTES,2);
     //IGV:0.18 %    
    }

    if(this.tipoCobertura == 2 || this.tipoCobertura == 3){//Incapacidad Temporal ó Invalidez Permanente
      //Obtenemos los beneficiarios
      this.datosBeneficiarios.PNCLAIM = this.siniestro;
      this.datosBeneficiarios.PNCOVER = this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = this.caso;    
      this.datosBeneficiarios.PPOLICY = this.poliza;
      this.ObtenerBeneficiarios(this.datosBeneficiarios);
      this.pendientePago = this.redondearDecimales(this.data[0].PAGOS_PEND_BENEF,2);
      //this.baseImponible = this.redondearDecimales(0,2);
      /* Cambio dia 12-07-23 este campo no se utiliza en estas coberturas
         this.totalFactura = this.redondearDecimales(this.baseImponible,2) ;
      */
    }

    if(this.tipoCobertura ==  1){//Muerte
      //Obtenemos los beneficiarios
      this.datosBeneficiarios.PNCLAIM = this.siniestro;
      this.datosBeneficiarios.PNCOVER = this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = this.caso;    
      this.datosBeneficiarios.PPOLICY = this.poliza;
      this.ObtenerBeneficiariosMuerte(this.datosBeneficiarios);
      this.pendientePago = this.redondearDecimales(this.data.reduce(function (acc, obj) { return acc + obj.PAGOS_PEND_BENEF; }, 0),2);
    }

  }

  redondearDecimales(numero, decimales) {

    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');// Expresion regular para numeros con un cierto numero de decimales o mas
    
    if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number(numero.toFixed(decimales));
    } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
    

    /*
    const numero_decimal1 = new RegExp('\\d\\.(\\d){' + 1 + ',}');   
    const numero_decimal2 = new RegExp('\\d\\.(\\d){' + 2 + ',}');

    const n_num = numero === 0 ? 0 : Number(numero.toFixed(decimales) + ("")  )   ;
    return n_num;*/
    
  }

  buscarDatosPago(data : DatosSiniestro){//comentar en el back
    
     this.service.ObtenerDatosGastosSepMed(data).subscribe(
      s => {
        console.log(s);
        this.datosPago = s;
        console.log('ObtenerDatosGastosSepMed: '); 
        console.log(this.datosPago);    

        this.poliza = this.datosPago.NPOLICY;
        //this.placa = "ABC 123";
        this.docSiniestrado = this.datosPago.SCLIENT;
        this.siniestrado = this.datosPago.SCLIENAME;
        this.fechaOcurrencia = this.datosPago.DOCCURDAT;
        this.fechaDenuncia = this.datosPago.FECHADECLARACION;
        this.fechaApertura = this.datosPago.FECHAAPERTURA;
        this.placa = this.datosPago.SREGIST;
        /*comentado tania
        this.codDiagnostico = this.datosPago.SCODIGODIAGNOSTICO;
        this.especialidad = this.datosPago.SESPECIALIDAD;
        this.nroFactura = this.datosPago.NBILL;
        this.fechaEmisionFac = this.datosPago.FECHAEMISIONFACTURA;
        this.fechaRecibeFac = this.datosPago.FECHARECEPCIONFACTURA;
        fin comentado tania
        */
        
        /*this.banco = this.datosPago.NOMBRE_BANCO;
        this.nroCuenta = this.datosPago.SACCOUNT;

      
        this.baseImponible = this.datosPago.NAMOUNT;
      
         if(this.banco == "" && this.nroCuenta == ""){
           Swal.fire('Información','No esta registrado el Banco y el Nro. de Cuenta', 'warning');
         }else{
           if(this.banco == "" && this.nroCuenta != ""){
             Swal.fire('Información','No esta registrado el Banco.', 'warning');
           }else{
             if(this.banco != "" && this.nroCuenta == ""){
               Swal.fire('Información','No esta registrado el Nro. de Cuenta.', 'warning');
             }
           }
         }*/
        
      },
      e => {
        console.log(e);
      });
      
      return this.datosPago;
  }

  GetListaTipoPago(){
    this.service.GetListaTipoPago().subscribe(
      s => {        
        this.tipoPago = s;
        console.log(this.tipoPago);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  GetListaFormaPago(){
    this.service.GetListaFormaPago().subscribe(
      s => {        
        this.formaPago = s;
        console.log(this.formaPago);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  ObtenerBeneficiarios(data : DatosBeneficiarios){
    SwalCarga();

    this.service.ObtenerBeneficiarios(data).subscribe(
      s => {        
        this.salidaBeneficiarios = s;
        this.salidaBenef_Origen = s;
        /*  if(this.salidaBeneficiarios.length == 0){
           Swal.fire('La cobertura no tiene beneficiarios asociados');
           this.modalService.dismissAll();
           return;
         }else{  */
             
          if (this.salidaBeneficiarios.length >0){ 
            const selectElement = document.getElementById("nomBeneficiarios") as HTMLSelectElement;
            const selectFecFinAnalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;

            this.objBeneficiario = this.salidaBeneficiarios[0];
            this.CbonomBeneficiarios = "0";

            if (this.salidaBeneficiarios.length  == 1){  
              
              //selectElement.value = this.salidaBeneficiarios[0].SCLIENT;;
                this.CbonomBeneficiarios = this.salidaBeneficiarios[0].SCLIENT;

                this.tipoDocumento = this.salidaBeneficiarios[0].SSHORT_DES;
                this.nroDocumento = this.salidaBeneficiarios[0].DOCUMENTO;

                const v_diagn = this.salidaBeneficiarios[0].DIAGNOSTICO
                if(v_diagn != ""){
                   this.codDiagnostico = v_diagn.split(":")[0];
                   this.txtDiagnostico = v_diagn.split(":")[1];
                }                

                this.especialidad = this.salidaBeneficiarios[0].ESPECIALIDAD;
                this.idBanco = this.salidaBeneficiarios[0].NBANKEXT;
                this.banco = this.salidaBeneficiarios[0].NOMBRE_BANCO;
                this.nroCuenta = this.salidaBeneficiarios[0].SACCOUNT;   
                this.totalFactura = this.redondearDecimales(this.salidaBeneficiarios[0].MONTO_PAGO,2);//monto a pagar por beneficario
                this.PendPagoClient = this.redondearDecimales(this.salidaBeneficiarios[0].MONTO_PAGO,2);//monto a pagar por beneficario
                this.pendientePagoCob = this.redondearDecimales(this.salidaBeneficiarios[0].MONTO_PAGO2,2);
                this.cant_facturas = this.salidaBeneficiarios[0].CANT_FACTURAS;  
                this.reembolso = this.salidaBeneficiarios[0].REEMBOLSO;
                this.txttipopago = "10";                
                this.txtformapago = "0";

                if(this.salidaBeneficiarios[0].NOMBRE_BANCO!= "" && this.salidaBeneficiarios[0].SACCOUNT!= ""){
                  this.txtformapago = "10";  
                }else{
                  this.txtformapago = "11";
                }                
                
                if( (this.tipoCobertura == 4 || this.tipoCobertura == 5) && this.cant_facturas > 0){//this.reembolso == 2   gastos medicos y gastos de sepelio && this.salidaBeneficiarios[0].SCLIENT 
                  
                  this.formimporte.disable();
                  //Armamos lista para filtrar las facturas de ese cliente
                  //if(this.cant_facturas > 0 ){

                      this.FiltroList_Fact[0]= {
                        PNCLAIM : parseInt(data.PNCLAIM),
                        PCASENUM : parseInt(data.PCASENUM),
                        PNCOVER : data.PNCOVER,
                        PSCLIENT : this.salidaBeneficiarios[0].SCLIENT
                      };

                      this.ObtenerListarFacturas(this.FiltroList_Fact[0]);
                  //}
                }else{
                  this.formimporte.enable();
                } 

                selectFecFinAnalisis.focus();

            }else{
              selectElement.focus();
            }

             
          }
          
        //} 
        Swal.close();  
        console.log('Beneficiarios: '); 
        console.log(this.salidaBeneficiarios);        
      },
      e => {
        Swal.close();
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  ObtenerBeneficiariosMuerte(data : DatosBeneficiarios){
  SwalCarga();
    console.log(data);
    this.service.ObtenerBeneficiariosMuerte(data).subscribe(
      s => {        
        this.salidaBeneficiariosMuerte = s;

        const v_diagn = this.salidaBeneficiariosMuerte[0].DIAGNOSTICO
        if(v_diagn != ""){
           this.codDiagnostico = v_diagn.split(":")[0];
           this.txtDiagnostico = v_diagn.split(":")[1];
        }                

        this.especialidad = this.salidaBeneficiariosMuerte[0].ESPECIALIDAD;

        const selectfinanalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;
        selectfinanalisis.focus();    

        this.sfila = 1;
        this.salidaBeneficiariosMuerte.forEach(benef => {
            benef.FILA = this.sfila;
            this.sfila = (this.sfila + 1)

            benef.m_tipopago = "10";

            if(benef.NOMBRE_BANCO!="" && benef.SACCOUNT!=""){
              benef.m_formapago= "10";
            }else{
              benef.m_formapago= "11";
            }            
        });
        console.log('Beneficiarios Muerte: '); 
        console.log(this.salidaBeneficiariosMuerte);      
        Swal.close();    
      },
      e => {
        Swal.close();
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  /*Obtener_ListaBeneficiarios(data : DatosBeneficiarios){
    this.service.ObtenerBeneficiarios(data).subscribe(
      s => {        
        this.salidaBeneficiarios = s;
        console.log('Salida longitud lista: ' + this.salidaBeneficiarios.length.ing(toStr));
        if (this.salidaBeneficiarios.length > 0){
          //console.log(this.baseImponible);
          //this.totalPagarMuerte = this.baseImponible / this.salidaBeneficiarios.length;
          //console.log(this.totalPagarMuerte);
        }
        console.log(this.salidaBeneficiarios);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  } */
  //salidaBeneficiariosMuerte

  cambioBeneficiario(){ //vsclient: string
    SwalCarga();
    this.Clear_Inputs();

    const selectElement = document.getElementById("nomBeneficiarios") as HTMLSelectElement;
    const vsclient = selectElement.value;
    console.log(vsclient);

    if (vsclient != "0"){
          let lstbenef = this.salidaBenef_Origen.filter(x => x.SCLIENT == vsclient);

          const cod_client = lstbenef[0].SCLIENT; 
          const tipoDoc = lstbenef[0].SSHORT_DES; 
          const numDoc = lstbenef[0].DOCUMENTO; 
          const idBanco = lstbenef[0].NBANKEXT; 
          const nomBanco = lstbenef[0].NOMBRE_BANCO; 
          const numCuenta = lstbenef[0].SACCOUNT; 
          const montoPago = lstbenef[0].MONTO_PAGO; 
          const m_diagn = lstbenef[0].DIAGNOSTICO; 
          const m_espec = lstbenef[0].ESPECIALIDAD; 
          const cant_fac = lstbenef[0].CANT_FACTURAS;  
          this.pendientePagoCob = lstbenef[0].MONTO_PAGO2; 
          this.reembolso = lstbenef[0].REEMBOLSO; 

          /*
          const cod_client = selectedValue.split("|")[0]; 
          const tipoDoc = selectedValue.split("|")[1];
          const numDoc = selectedValue.split("|")[2];
          const idBanco = selectedValue.split("|")[3];
          const nomBanco = selectedValue.split("|")[4];
          const numCuenta = selectedValue.split("|")[5];
          const montoPago = selectedValue.split("|")[6];
          const m_diagn = selectedValue.split("|")[7];  
          const m_espec = selectedValue.split("|")[8];  
          const cant_fac = selectedValue.split("|")[9];  
          this.pendientePagoCob = this.redondearDecimales(parseFloat(selectedValue.split("|")[10]),2); 
          this.reembolso = parseInt(selectedValue.split("|")[11]); 
          */
          //his.pendientePagoCob = this.redondearDecimales(this.salidaBeneficiarios[0].MONTO_PAGO2,2);
          console.log(montoPago);
          this.tipoDocumento = tipoDoc;
          this.nroDocumento = numDoc;

          if(m_diagn != ""){
              this.codDiagnostico = m_diagn.split(":")[0];
              this.txtDiagnostico = m_diagn.split(":")[1];
          }  

          this.especialidad = m_espec;
          this.idBanco = idBanco;
          this.banco = nomBanco;
          this.nroCuenta = numCuenta;    
          this.totalFactura = this.redondearDecimales((montoPago),2); //monto a pagar por factura del beneficario
          this.PendPagoClient = this.redondearDecimales((montoPago),2);//monto a pagar por beneficario
          this.cant_facturas = cant_fac;  

          this.nroFactura = "";
          this.fechaEmisionFac = "";
          this.fechaRecibeFac = "";
          this.baseImponible = 0;
          this.igv = 0;
          this.totalComprobante = 0;
          this.pendpagofac = 0;
          this.txttipopago = "10";                
          this.txtformapago = "0";
          this.salidaFacturas = [];

          if(this.banco!= "" && this.nroCuenta!= ""){
            this.txtformapago = "10";  
          }else{
            this.txtformapago = "11";
          }

          if((this.tipoCobertura == 4 || this.tipoCobertura == 5) && this.cant_facturas > 0){ //this.reembolso == 2  gastos medicos y gastos de sepelio  && this.salidaBeneficiarios[0].SCLIENT 

            this.formimporte.disable();

              this.FechaFinAnalisis = "";
              //Armamos lista para filtrar las facturas de ese cliente
              //if(this.cant_facturas > 0 ){
                  this.FiltroList_Fact[0]= {
                    PNCLAIM : parseInt(this.datosBeneficiarios.PNCLAIM),
                    PCASENUM : parseInt(this.datosBeneficiarios.PCASENUM),
                    PNCOVER : (this.datosBeneficiarios.PNCOVER),
                    PSCLIENT : (cod_client)
                  };

                this.ObtenerListarFacturas(this.FiltroList_Fact[0]);
              //}
          }else{
            this.formimporte.enable();
          }
        const selectfinanalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;
        selectfinanalisis.focus();


   }
   Swal.close();  
  }

  ObtenerListarFacturas(data : FiltroList_Fact){//?????????????????
    this.service.ObtenerListarFacturas(data).subscribe(
      s => {        
        this.salidaFacturas = s;
        this.salidaFact_Origen = s;
        console.log(s);
        if (this.salidaFacturas.length > 0 ){
          if (this.salidaFacturas.length  == 1){
            
            this.nroFactura = this.salidaFacturas[0].NUM_FACTURA;
            //const fecha_emis = (this.salidaFacturas[0].FECHAEMISIONFACTURA);
            //const fecha_RECEP = (this.salidaFacturas[0].FECHARECEPCIONFACTURA);

            this.fechaEmisionFac = this.salidaFacturas[0].FECHAEMISIONFACTURA; //(fecha_emis).toString();
            this.fechaRecibeFac = this.salidaFacturas[0].FECHARECEPCIONFACTURA; //(fecha_RECEP).toString();
            this.baseImponible = this.redondearDecimales(this.salidaFacturas[0].BASE_IMPONIBLE,2);
            this.igv =  this.redondearDecimales(this.salidaFacturas[0].IGV,2);//(this.baseImponible * 0.18 ).toFixed(2);
            this.totalComprobante = this.redondearDecimales(this.salidaFacturas[0].TOTAL_COMP,2);//(this.baseImponible + Number(this.igv)).toFixed(2);
            this.totalFactura = this.redondearDecimales(this.salidaFacturas[0].TOTAL_PAGAR_FAC,2);//montoPago tengo que considerar los pagos que se a hecho a la factura
            this.pendpagofac = this.redondearDecimales(this.salidaFacturas[0].TOTAL_PAGAR_FAC,2);
          }
        }
        const selectfinanalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;
        selectfinanalisis.focus();

        console.log('Facturas: '); 
        console.log(this.salidaFacturas);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  cambioFactura(){

    const selectElement = document.getElementById("CboFactura") as HTMLSelectElement;
    const vfact = selectElement.value;
    console.log(vfact);

    if(vfact !='0'){
      let lstfact = this.salidaFact_Origen.filter(x => x.NUM_FACTURA == vfact);

      const nroFactura = lstfact[0].NUM_FACTURA; 
      const fechaEmisionFac = lstfact[0].FECHAEMISIONFACTURA; 
      const fechaRecibeFac = lstfact[0].FECHARECEPCIONFACTURA; 
      const baseImponible = lstfact[0].BASE_IMPONIBLE;
      const m_igv = lstfact[0].IGV;  
      const m_total_comp = lstfact[0].TOTAL_COMP; 
      const m_total_pagar_fac = lstfact[0].TOTAL_PAGAR_FAC; 
  
      /*
      const nroFactura = selectedValue.split("|")[0]; 
      const fechaEmisionFac = selectedValue.split("|")[1]; 
      const fechaRecibeFac = selectedValue.split("|")[2]; 
      const baseImponible = selectedValue.split("|")[3];
      const m_igv = selectedValue.split("|")[4];  
      const m_total_comp = selectedValue.split("|")[5]; 
      const m_total_pagar_fac = selectedValue.split("|")[6]; 
      
      */
  
      this.nroFactura = nroFactura;
      this.fechaEmisionFac = fechaEmisionFac;
      this.fechaRecibeFac = fechaRecibeFac;
      this.baseImponible = this.redondearDecimales(baseImponible,2);
      this.igv = this.redondearDecimales(m_igv,2); //(this.baseImponible * 0.18 ).toFixed(2);
      this.totalComprobante = this.redondearDecimales(m_total_comp,2); //(this.baseImponible + Number(this.igv)).toFixed(2);
      this.totalFactura = this.redondearDecimales(m_total_pagar_fac,2);  //montoPago tengo que considerar los pagos que se a hecho a la factura
      this.pendpagofac = this.redondearDecimales(m_total_pagar_fac,2);

      if (this.baseImponible > 0  ){
        this.formimporte.disable();
      }else{
        this.formimporte.enable();
      }

      
    }else{

      this.nroFactura = ""
      this.fechaEmisionFac = "";
      this.fechaRecibeFac = "";
      this.baseImponible = 0;
      this.igv = 0; //(this.baseImponible * 0.18 ).toFixed(2);
      this.totalComprobante =0; //(this.baseImponible + Number(this.igv)).toFixed(2);
      this.totalFactura = 0 ;  //montoPago tengo que considerar los pagos que se a hecho a la factura
      this.pendpagofac = 0;
      
    }
    
  }

  cambioTipoPago(){

  }
  
  cambioFormaPago(){
    const selectElement = document.getElementById("formaPago") as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if(selectedValue == "11" && this.banco != '' &&  this.nroCuenta != '' ){
      Swal.fire('Información','Esta cambiando la forma de pago a Cheque.', 'warning');
    }    
  }

  async IniciarPago(){

    this.BtnDisabled1 = true;//bloquear boton

    this.Campospago_validar =[];
    const selectElementBenef = document.getElementById("nomBeneficiarios") as HTMLSelectElement;
    const vsclient = selectElementBenef.value;    
    //const vsclient = vBenef.split("|")[0]; 

    if(vsclient=='0'){
       Swal.fire('Error',"Seleccione un beneficiario", 'error'); 
       this.BtnDisabled1 = false;

    }else{

      
        let lstbenef = this.salidaBenef_Origen.filter(x => x.SCLIENT == vsclient);

        const vreembolso = lstbenef[0].REEMBOLSO;
        //const tipoclient = vBenef.split("|")[1];  

        const selectElementbanco = document.getElementById("idBanco") as HTMLSelectElement;
        const vbanco = (selectElementbanco.value);
        const selectElementnroCuenta = document.getElementById("TxtnroCuenta") as HTMLSelectElement;
        const vnroCuenta = (selectElementnroCuenta.value);

        const selectElementTipoPago = document.getElementById("tipoPago") as HTMLSelectElement;
        const vTipoPago = parseInt(selectElementTipoPago.value);
        const selectElementFormaPago = document.getElementById("formaPago") as HTMLSelectElement;
        const vFormaPago = parseInt(selectElementFormaPago.value);
        //const selectElementPendPagarCob = document.getElementById("Txt_pendientePago") as HTMLSelectElement;//cambiarrrrrr
        const vPendPagarCob = this.redondearDecimales(this.pendientePagoCob,2);//this.redondearDecimales(parseFloat(selectElementPendPagarCob.value),2);      
        const selectElementPendPagoClient = document.getElementById("Txt_PendPagoClient") as HTMLSelectElement;
        const vPendPagoClient = this.redondearDecimales(parseFloat(selectElementPendPagoClient.value),2);      
        const selectElementMontoPago = document.getElementById("totalPago") as HTMLSelectElement;
        const vMontoPago = this.redondearDecimales(parseFloat((selectElementMontoPago.value == "" ? "0" : (selectElementMontoPago.value).replace(/,/g, "") )),2);
        const selectElementObserv = document.getElementById("TxtObservaciones") as HTMLSelectElement;
        const vObserv = selectElementObserv.value;
        const selectElementFinAnalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;
        const FinAnalisis = selectElementFinAnalisis.value; 

        //console.log("fechas:" + FinAnalisis +  "|" + this.datos_siniestro[0].DOCCURDAT  +  "|" + this.datosPago.FECHADECLARACION  +  "|" + this.datosPago.FECHAAPERTURA)


        if(lstbenef[0].CANT_FACTURAS > 0 && this.nroFactura!= '' ){//vreembolso == 2  tipoclient=='RUC'
          //const selectElementFactura = document.getElementById("nroFactura") as HTMLSelectElement;
          //const Factura = selectElementFactura.value;      
                    
          const selectElementPendPagoFact = document.getElementById("pendpagofac") as HTMLSelectElement;
          const PendPagoFact = this.redondearDecimales(parseFloat(selectElementPendPagoFact.value),2); 

          this.Campospago_validar[0] = {
            vsclient: vsclient,
            vReembolso : vreembolso,
            //vtipoclient: tipoclient, 
            vfactura : this.nroFactura ,//Factura,
            vfinanalisis : FinAnalisis,
            vbanco: vbanco, 
            vnroCuenta : vnroCuenta,         
            vTipoPago : vTipoPago,
            vFormaPago :vFormaPago,
            vPendPagarCob : vPendPagarCob,
            vpendpagofac : PendPagoFact,
            vPendPagoClient: vPendPagoClient,
            vMontoPago: vMontoPago,
            vObserv : vObserv
          };
          //this.procesarPagofactura(sclient, tipoclient, vbanco, vnroCuenta, vTipoPago, vFormaPago, vPendPagarCob,vPendPagoClient,vMontoPago,vObserv);
          
        }else{
          this.Campospago_validar[0] = {
            vsclient: vsclient,
            vReembolso : vreembolso,
            //vtipoclient: tipoclient, 
            vfactura : '',
            vfinanalisis : FinAnalisis,
            vbanco: vbanco, 
            vnroCuenta : vnroCuenta,         
            vTipoPago : vTipoPago,
            vFormaPago :vFormaPago,
            vPendPagarCob : vPendPagarCob,
            vpendpagofac : 0,
            vPendPagoClient: vPendPagoClient,
            vMontoPago: vMontoPago,
            vObserv : vObserv
          };
          //this.procesarPago(this.Campospago_validar[0]);//sclient, tipoclient, vbanco, vnroCuenta, vTipoPago, vFormaPago, vPendPagarCob, vPendPagoClient, vMontoPago,vObserv);
        }
        //INICIAR VALIDACIONES Y PROCESO DE PAGO this.procesarPago(this.Campospago_validar[0]);

        const messageVal = await this.Validaciones(this.Campospago_validar[0]);//sclient, tipoclient, '', ''/*FinAnalisis*/, TipoPago, FormaPago, PendPagarCob, 0 ,PendPagoClient, MontoPago);
        let cookie = this.authProtectaService.getCookie('AppSiniestro');
        let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);

        this.FiltroProcesoPago=[];

        this.FiltroProcesoPago[0]= {
          P_NCLAIM : parseInt(this.siniestro),
          P_NCASE : parseInt(this.caso),
          //P_NBRANCH : ,
          //P_NPRODUCT : ,
          P_NPOLICY : parseInt(this.poliza),
          P_NCOVER : this.tipoCobertura,
          //P_NMODULEC : ,
          //P_NCURRENCY  : ,        
          P_SCLIENT : this.Campospago_validar[0].vsclient,
          P_NUMFACT : this.Campospago_validar[0].vfactura,//solo factura
          P_DFINANALISIS : this.Campospago_validar[0].vfinanalisis,//solo factura          
          P_FEC_EMISION_FAC : this.fechaEmisionFac,
          P_FEC_RECEP_FAC : this.fechaRecibeFac,
          P_NOPER_TYPE : this.Campospago_validar[0].vTipoPago,
          P_NPAY_FORM : this.Campospago_validar[0].vFormaPago,
          P_NBANKEXT : this.Campospago_validar[0].vbanco,
          P_SACCOUNT :this.Campospago_validar[0].vnroCuenta,
          P_NAMOUNT : this.Campospago_validar[0].vMontoPago,
          P_OBSERVACIONES : this.Campospago_validar[0].vObserv,
          P_COD_DIAG : this.codDiagnostico,
          P_ESPECIALIDAD : this.especialidad,
          P_NUSERCODE : Number(atob(codUsuario))
        };  
        
        if( messageVal != ""){
          const tipo_message = messageVal.split("|")[0]; 
          const scampo = messageVal.split("|")[1]; 
          const message = messageVal.split("|")[2]; 
          //proceso pago factura

          if(tipo_message =="E"){//Errores
            Swal.fire('Error',message, 'error');

            //if(scampo == "fa"){
            //}else
            if(scampo == "ffa"){
              selectElementFinAnalisis.focus();
            }else if(scampo == "tp"){
              selectElementTipoPago.focus();
            }else if(scampo == "fp"){
              selectElementFormaPago.focus();
            }else if(scampo == "mp"){
              selectElementMontoPago.focus();              
            }
            
            this.BtnDisabled1 = false;

          }else if (tipo_message =="A"){//advertencias
            Swal.fire({
              title: 'Información',
              html: message  + " <br /> ¿Esta seguro de realizar el pago?", //Desea Continuar
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              cancelButtonText: 'No'
            }).then((result) => {
              if(result.value){
                  this.EnviarPago(this.FiltroProcesoPago[0]);
              }else{
                this.BtnDisabled1 = false;
                console.log('Nos quedamos.');
              }
            });
          }
        }else{
          Swal.fire({
            title: 'Información',
            text: '¿Esta seguro de realizar el pago?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
          }).then((result) => {
            if(result.value){
              console.log(this.FiltroProcesoPago);
                this.EnviarPago(this.FiltroProcesoPago[0]);
            }else{
              this.BtnDisabled1 = false;
              console.log('Nos quedamos.');
            }
          });
        }
    }
  }

  //procesarPago(vCampospago_validar : Campospago_validar) {////(sclient: string, tipoclient : string ,  vbanco :string, vnroCuenta: string, TipoPago : number, FormaPago : number, PendPagarCob : number,PendPagoClient : number, MontoPago : number,  Observ: string){
   //}

   async IniciarPagoMuerte(){       
    this.BtnDisabled2 = true;
    let Envio_Data : any[];
    Envio_Data = [];
    this.messageMVal = "";

    this.Campospago_validar =[];
    const selectElementFinAnalisis = document.getElementById("TxtFechaFinAnalisis") as HTMLSelectElement;
    const selectElementPendPagar= document.getElementById("Txt_pendientePago") as HTMLSelectElement;
    const vPendPagar= this.redondearDecimales(parseFloat(selectElementPendPagar.value),2);     
    const vfinanalisis = parseInt((this.FechaFinAnalisis).replace(/-/g, ""));
  

    let result = this.salidaBeneficiariosMuerte.filter(x => x.SELECT == true);
   
    let lstdatos = result.sort((a, b) => parseInt(a.m_tipopago) - parseInt(b.m_tipopago));

    const suma_montos = lstdatos
                          .map(t => t["MONTO_PAGO"] ?? 0) 
                          .reduce((acc, value) => acc + value, 0);

    const count_benef = this.salidaBeneficiariosMuerte.length; 
    const count_benef_pagar = lstdatos.length;    
    const count_pay_total = (lstdatos.filter(x => x.m_tipopago == "11")).length;


    if(this.FechaFinAnalisis != ''){// agregar No puede ser antes de la fecha de denuncio, ni fecha de apertura. vCampospago_validar.vtipoclient=='RUC' && 
      const fec_act = new Date();
      const shoy = parseInt((this.formato_fecha(fec_act, 'dd/mm/yyyy')).replace(/-/g, ""));  

      const txt_fechaOcurrencia= document.getElementById("Txt_fechaOcurrencia") as HTMLSelectElement;
      const vfechaOcurrencia= parseInt((txt_fechaOcurrencia.value).replace(/-/g, ""));
      const txt_fechaDenuncia= document.getElementById("Txt_fechaDenuncia") as HTMLSelectElement;
      const vfechaDenuncia= parseInt((txt_fechaDenuncia.value).replace(/-/g, ""));
      const txt_fechaApertura= document.getElementById("Txt_fechaApertura") as HTMLSelectElement;
      const vfechaApertura= parseInt((txt_fechaApertura.value).replace(/-/g, ""));

      //this.messageMVal="E";
      //selectElementFinAnalisis.focus();
      //Swal.fire('Error',"Ingrese la fecha de fin de análisis", 'error');
      if((vfinanalisis > shoy )){

        this.messageMVal="E";
        selectElementFinAnalisis.focus();
        Swal.fire('Error',"La fecha de fin de análisis no puede ser mayor a la fecha actual", 'error');
        
      }else if((vfinanalisis < vfechaOcurrencia )){
  
        this.messageMVal="E";
        selectElementFinAnalisis.focus();
        Swal.fire('Error',"La fecha de fin de análisis es menor a la fecha de ocurrencia", 'error');
        
      }else if((vfinanalisis < vfechaDenuncia ) ){
  
        this.messageMVal="E";
        selectElementFinAnalisis.focus();
        Swal.fire('Error',"La fecha de fin de análisis es menor a la fecha de declaración", 'error');
        
  
      }else if((vfinanalisis < vfechaApertura) ){
  
        this.messageMVal="E";
        selectElementFinAnalisis.focus();
        Swal.fire('Error',"La fecha de fin de análisis es menor a la fecha de apertura", 'error');    
      }

    } 

    if(count_pay_total >=2 &&  this.messageMVal != "" ){
      //no puede ingresar mas de un pago total.
      this.messageMVal="E";
      Swal.fire('Error',"No puede ingresar mas de un pago total", 'error');
      
    }/* else if(count_benef_pagar < count_benef && count_pay_total == 1 ) {
      //no puede ingresar un pago total porque existe beneficiarios por pagar.
      this.messageMVal="E";
      Swal.fire('Error',"No puede ingresar un registro con pago total porque existe beneficiarios por pagar", 'error');

    }  */ 
       
    if (this.messageMVal!=""){
      this.BtnDisabled2 = false;
      return false;
    }
    
    if(lstdatos.length < 1){//!lstdatos
      Swal.fire('Error',"Debe seleccionar los beneficiarios a pagar", 'error');
      this.BtnDisabled2 = false;
      return;
    }else{      
        lstdatos.forEach(benef => {
            if(benef.SELECT){                  
                if(this.messageMVal == ""){
                    this.Campospago_validar[0] = {
                      vsclient: benef.SCLIENT,
                      vReembolso : 0,
                      //vtipoclient: "", 
                      vfactura : "",
                      vfinanalisis : this.FechaFinAnalisis,
                      vbanco: benef.NBANKEXT, 
                      vnroCuenta : benef.SACCOUNT,         
                      vTipoPago : parseInt(benef.m_tipopago),
                      vFormaPago : parseInt(benef.m_formapago),
                      vPendPagarCob : 0,//llamar a la bd
                      vpendpagofac : 0,
                      vPendPagoClient: benef.MONTO_PAGO2,
                      vMontoPago: (benef.MONTO_PAGO == null ? 0 : benef.MONTO_PAGO),
                      vObserv : benef.Observaciones
                    };
                    
                    //this.messageMVal = await this.Validaciones_Muerte(this.Campospago_validar[0]);

                        //validaciones generales de los campos fila por fila
                    const messageVal = this.Validaciones_Muerte(this.Campospago_validar[0]);
                    this.messageMVal = messageVal;
                    
                    if(this.messageMVal != ""){

                      const tipo_message = this.messageMVal.split("|")[0]; 
                      const scampo =  this.messageMVal.split("|")[1]; 
                      const message =  this.messageMVal.split("|")[2];
                      
                      Swal.fire('Error',message + "<br />  N° Beneficiario: " + benef.FILA, 'error');
                      //focus
                      //(benef.SACCOUNT).focus();
                      this.BtnDisabled2 = false;
                      
                      return;
                    }else{
                           
                      let cookie = this.authProtectaService.getCookie('AppSiniestro');
                      let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);

                        Envio_Data.push({              
                            P_NCLAIM : parseInt(this.siniestro),
                            P_NCASE : parseInt(this.caso),
                            //P_NBRANCH : ,
                            //P_NPRODUCT : ,
                            P_NPOLICY : parseInt(this.poliza),
                            P_NCOVER : this.tipoCobertura,
                            //P_NMODULEC : ,
                            //P_NCURRENCY  : ,        
                            P_SCLIENT : benef.SCLIENT,
                            P_NUMFACT : '',
                            P_DFINANALISIS : this.FechaFinAnalisis,
                            P_FEC_EMISION_FAC : '',
                            P_FEC_RECEP_FAC : '',                            
                            P_NOPER_TYPE : benef.m_tipopago,
                            P_NPAY_FORM : benef.m_formapago,
                            P_NBANKEXT : benef.NBANKEXT,
                            P_SACCOUNT : benef.SACCOUNT,
                            P_NAMOUNT : benef.MONTO_PAGO,
                            P_OBSERVACIONES : benef.Observaciones,
                            P_COD_DIAG : this.codDiagnostico,
                            P_ESPECIALIDAD : this.especialidad,
                            P_NUSERCODE : Number(atob(codUsuario))                 
                        });

                    }


                } 
            }
          })

          /*
          if(count_benef_pagar == count_benef && count_pay_total == 1 && suma_montos < vPendPagar){
            //no puede ingresar un pago total porque el monto a pagar es menor a lo pendiente  
            this.messageMVal="E";
            Swal.fire('Error',"No puede ingresar un pago total porque el monto a pagar es menor a lo pendiente.", 'error');

          }else if(count_benef_pagar == count_benef && count_pay_total == 0 && suma_montos == vPendPagar){
            //debe seleccionar un beneficiario con pago total
            this.messageMVal="E";
            Swal.fire('Error',"El ultimo beneficiario debe ser pago total", 'error');

          }*/


          //validar si hay registros en la lista

          if(this.messageMVal == ""){
                //validaciones de los montos con la reserva pendiente por liquidar
                this.FiltroValidar[0]= {
                  P_NCLAIM : parseInt(this.siniestro),
                  P_NCASE : parseInt(this.caso),
                  P_NCOVER : this.tipoCobertura,   
                  P_SCLIENT : '',
                  P_REEMBOLSO: 0,
                  P_NUMFACT : '',
                  P_NOPER_TYPE : (count_pay_total > 0 ? 11 : 10),
                  P_NAMOUNT : suma_montos,
                }
          
                let vdata = await this.validarbd();
                
                this.salidaValidaciones[0] = vdata[0]; 
                console.log(vdata);      
                if (this.salidaValidaciones.length > 0){ 
                  if(this.salidaValidaciones[0].STATUS == '1'){
                    this.messageMVal = this.salidaValidaciones[0].MENSAJE;      
                  }
                }

                if(this.messageMVal != ""){//se verifica si hay mensaje de advertencia o error de la bd

                  const tipo_message_bd = this.messageMVal.split("|")[0]; 
                  const scampo_bd =  this.messageMVal.split("|")[1]; 
                  const message_bd =  this.messageMVal.split("|")[2];
                  
                    if (tipo_message_bd == "E") {//mensajes de error de la bd
                        Swal.fire('Error',message_bd , 'error');
                        //focus
                        //(benef.SACCOUNT).focus();
                        this.BtnDisabled2 = false;

                    }else if (tipo_message_bd == "A") {//mensajes de advertencia de la bd
                      Swal.fire({
                        title: 'Información',
                        html: message_bd + " <br /> ¿Esta seguro de realizar el pago?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No'
                      }).then((result) => {
                        if(result.value){
                          
                            this.FiltProcPagoMuerteEnvio = Envio_Data;
                            console.log(this.FiltProcPagoMuerteEnvio);
                            this.EnviarPagoMuerte(this.FiltProcPagoMuerteEnvio);
                        }else{
                          console.log('Nos quedamos.');
                          this.BtnDisabled2 = false;
                        }
                      });

                    }

                }else{//sin mensajes de advertencia de la bd
                      Swal.fire({
                        title: 'Información',
                        text: '¿Esta seguro de realizar el pago?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No'
                      }).then((result) => {
                        if(result.value){
                          
                            this.FiltProcPagoMuerteEnvio = Envio_Data;
                            console.log(this.FiltProcPagoMuerteEnvio);
                            this.EnviarPagoMuerte(this.FiltProcPagoMuerteEnvio);
                        }else{
                          console.log('Nos quedamos.');
                          this.BtnDisabled2 = false;
                        }
                      });
               }

          }else{
            this.BtnDisabled2 = false;
          }
    }

    /*
    const selectElementTipoPago = document.getElementById("formaPago") as HTMLSelectElement;
    const selectedValueTipoPago = selectElementTipoPago.value;
    const selectElementMontoPago = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueMontoPago = selectElementMontoPago.value;
    const selectElementTotalBenef = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueTotalBenef = selectElementTotalBenef.value;
    console.log(selectedValueTipoPago);
    console.log(selectedValueMontoPago);
    console.log(this.baseImponible);

    if (selectedValueTipoPago == "10" && Number(selectedValueMontoPago) > this.baseImponible){
      Swal.fire('Error','El monto a pagar no puede ser mayor al pendiente por pagar.', 'error');
      return;
    }
    if(selectedValueTipoPago == "10" && Number(selectedValueMontoPago) < this.baseImponible){
      Swal.fire({
        title: 'Información',
        text: 'El monto de la factura es menor a la base imponible, ¿Desea Continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
      if(result.value){
        console.log('Proceso el pago.'); //aqui se invoca el proceso de pago    ///se debe realizar el calculo del total a pagar por beneficiario
      }else{
        console.log('Nos quedamos.');
      }
    });
    }else{
      if(selectedValueTipoPago == "11" && Number(selectedValueMontoPago) < this.baseImponible){
        Swal.fire('Error','No se puede hacer pago total porque tiene reserva por pagar.', 'error');
        return;
      }else{
        if(selectedValueTipoPago == "11" && Number(selectElementTotalBenef) == 1 && Number(selectedValueMontoPago) < this.baseImponible){ //devolver el numero total de beneficiarios modificar el valor de selected
          Swal.fire('Error','No se puede hacer pago total porque el monto a pagar es menor al monto de base imponible.', 'error');
          return;
        }
      }
    }*/
  }

  async Validaciones(vCampospago_validar: Campospago_validar){//sclient : string , tipoclient :string, Factura : string, FinAnalisis : string , TipoPago : number, FormaPago : number, PendPagarCob: number, PendPagoFact: number,PendPagoClient: number, MontoPago: number){
     
    this.mensaje ='';   

    if ((this.tipoCobertura== 4 ||this.tipoCobertura== 5)  && (vCampospago_validar.vReembolso == 2 && vCampospago_validar.vfactura == '' && this.mensaje=='')){
      this.mensaje = "E|fa|No existe factura asociada al beneficiario";
      return this.mensaje;
    }
    if ((this.tipoCobertura== 4 ||this.tipoCobertura== 5)  && (vCampospago_validar.vfactura == '' && this.salidaFacturas.length >= 1 && this.mensaje=='' )){
      this.mensaje = "E|fa|Seleccione un comprobante";
      return this.mensaje;
    }
    
    if(vCampospago_validar.vfinanalisis != '' && this.mensaje==''){// agregar No puede ser antes de la fecha de denuncio, ni fecha de apertura. vCampospago_validar.vtipoclient=='RUC' && 
      const fec_act = new Date();
      const shoy = parseInt((this.formato_fecha(fec_act, 'dd/mm/yyyy')).replace(/-/g, ""));     
  
      const txt_fechaOcurrencia= document.getElementById("Txt_fechaOcurrencia") as HTMLSelectElement;
      const vfechaOcurrencia= parseInt((txt_fechaOcurrencia.value).replace(/-/g, ""));
      const txt_fechaDenuncia= document.getElementById("Txt_fechaDenuncia") as HTMLSelectElement;
      const vfechaDenuncia= parseInt((txt_fechaDenuncia.value).replace(/-/g, ""));
      const txt_fechaApertura= document.getElementById("Txt_fechaApertura") as HTMLSelectElement;
      const vfechaApertura= parseInt((txt_fechaApertura.value).replace(/-/g, ""));
      const vfinanalisis = parseInt((vCampospago_validar.vfinanalisis).replace(/-/g, ""));
      
      //this.mensaje = "E|ffa|Ingrese la fecha de fin de análisis";     
      //return this.mensaje;

      if((vfinanalisis > shoy ) && this.mensaje==''){

        this.mensaje = "E|ffa|La fecha de fin de análisis no puede ser mayor a la fecha actual";
        return this.mensaje;
  
      }    
      else if((vfinanalisis < vfechaOcurrencia ) && this.mensaje==''){
  
        this.mensaje = "E|ffa|La fecha de fin de análisis es menor a la fecha de ocurrencia";
        return this.mensaje;
  
      }else if((vfinanalisis < vfechaDenuncia ) && this.mensaje==''){
  
        this.mensaje = "E|ffa|La fecha de fin de análisis es menor a la fecha de declaración";
        return this.mensaje;
  
      }else if((vfinanalisis < vfechaApertura) && this.mensaje==''){
  
        this.mensaje = "E|ffa|La fecha de fin de análisis es menor a la fecha de apertura";
        return this.mensaje;
  
      } 

    } 
    
    
    if (vCampospago_validar.vTipoPago == 0 && this.mensaje==''){
      this.mensaje = "E|tp|Seleccione un tipo de pago";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago ==0 && this.mensaje==''){
      this.mensaje = "E|fp|Seleccione una forma de pago";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago == 10 && vCampospago_validar.vbanco== ''&& this.mensaje==''){
      this.mensaje = "E|fp|No existe un banco asociado al beneficiario";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago == 10 && vCampospago_validar.vnroCuenta==''&& this.mensaje==''){
      this.mensaje = "E|fp|No existe un número de cuenta asociado al beneficiario";
      return this.mensaje;

    }else if (vCampospago_validar.vMontoPago < 1  && this.mensaje==''){
      this.mensaje = "E|mp|Ingrese el importe a pagar";
      return this.mensaje;
    }

    if (this.mensaje ==''){

      this.FiltroValidar[0]= {
        P_NCLAIM : parseInt(this.siniestro),
        P_NCASE : parseInt(this.caso),
        P_NCOVER : this.tipoCobertura,   
        P_SCLIENT : vCampospago_validar.vsclient,
        P_REEMBOLSO: vCampospago_validar.vReembolso,
        P_NUMFACT : vCampospago_validar.vfactura,
        P_NOPER_TYPE : vCampospago_validar.vTipoPago,
        P_NAMOUNT : vCampospago_validar.vMontoPago,
      }

      let vdata = await this.validarbd();
      this.salidaValidaciones[0] = vdata[0]; 
      console.log(vdata);      
      if (this.salidaValidaciones.length > 0){ 
        if(this.salidaValidaciones[0].STATUS == '1'){
          this.mensaje = this.salidaValidaciones[0].MENSAJE;
          return this.mensaje;

        }
      }

      /*
      let reps =  this.service.Validaciones_Coberturas(this.FiltroValidar[0]).toPromise();

      if (this.salidaValidaciones.length > 0){ 
        if(this.salidaValidaciones[0].STATUS == '1'){
          this.mensaje = this.salidaValidaciones[0].MENSAJE;
          return this.mensaje;
        }
      }*/

    /*  {
          next: (v) => console.log(v),
          error: (e) => console.error(e),
          complete: () => console.info('complete') 
      }*/
      
        //var subject1 = new Subject<string>();
       
       /* this.service.Validaciones_Coberturas(this.FiltroValidar[0]).subscribe(
            
         s => { 
          //s.map(item => {      
              (this.salidaValidaciones = s);
              console.log('VALIDACIONES: '); 
              console.log(this.salidaValidaciones); 

              if (this.salidaValidaciones.length > 0){ 
                if(this.salidaValidaciones[0].STATUS == '1'){
                  this.mensaje = this.salidaValidaciones[0].MENSAJE;
                 // subject1.next(this.mensaje);
                }
              }
              return this.mensaje; 
           //});        
        },
        e => {
          console.log(e);
          //dialogRefLoad.close();
        }        
        );  */ 

     //si no hay errores
     return this.mensaje;      
    }
      /*
    //********VALIDACIONES PAGO FACTURA**************************** vCampospago_validar.vtipoclient=='RUC'
     if((vCampospago_validar.vReembolso == 2  && vCampospago_validar.vfactura != '')  && (vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vpendpagofac) && this.mensaje==''){//menor al monto pendiente de la factura
      this.mensaje = "E|tp|No se puede hacer pago total porque tiene reserva por pagar.";

    }else if((vCampospago_validar.vReembolso == 2  && vCampospago_validar.vfactura != '')  && (vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago > vCampospago_validar.vpendpagofac) && this.mensaje==''){//menor al monto pendiente de la factura
      this.mensaje = "E|mp|El monto a pagar no puede ser mayor al pendiente por pagar de la factura.";

    }else if((vCampospago_validar.vReembolso == 2  && vCampospago_validar.vfactura != '')  &&(vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagarCob) && this.mensaje==''){//aun hay beneficiarios por pagar
      this.mensaje = "E|mp|No se puede hacer pago total porque tiene reserva por pagar.";
    }

    else if ((vCampospago_validar.vReembolso == 2  && vCampospago_validar.vfactura != '')  &&(vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago > vCampospago_validar.vpendpagofac) && this.mensaje==''){//this.baseImponible      
      this.mensaje = "E|mp|El monto a pagar no puede ser mayor al pendiente por pagar de la factura.";
    }else if ((vCampospago_validar.vReembolso == 2  && vCampospago_validar.vfactura != '')  &&(vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago == vCampospago_validar.vpendpagofac && vCampospago_validar.vpendpagofac == vCampospago_validar.vPendPagarCob) && this.mensaje==''){
      this.mensaje = "E|mp|El monto a pagar es igual a la reserva pendiente de la cobertura.";
    }else if ((vCampospago_validar.vReembolso == 2 && vCampospago_validar.vfactura != '')  && (vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago < vCampospago_validar.vpendpagofac) && this.mensaje==''){
      this.mensaje = "A|mp|El monto a pagar es menor a la base imponible.";
    }

   //********VALIDACIONES PERSONA NATURA**************************** vCampospago_validar.vtipoclient=='DNI'
    else if(( vCampospago_validar.vReembolso != 2 && vCampospago_validar.vfactura == '')  && (vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagoClient) && this.mensaje==''){//menor al monto pendiente de la factura
      this.mensaje = "E|mp|No se puede hacer pago total porque tiene reserva por pagar.";

    }else if((vCampospago_validar.vReembolso != 2  && vCampospago_validar.vfactura == '') && (vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagarCob) && this.mensaje==''){//aun hay beneficiarios por pagar
      this.mensaje = "E|mp|No se puede hacer pago total porque tiene reserva por pagar.";
    }
    else if ((vCampospago_validar.vReembolso != 2  && vCampospago_validar.vfactura == '') &&(vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago > vCampospago_validar.vPendPagoClient) && this.mensaje==''){//this.baseImponible      
      this.mensaje = "E|mp|El monto a pagar no puede ser mayor al pendiente por pagar del beneficiario.";
    }else if ((vCampospago_validar.vReembolso != 2  && vCampospago_validar.vfactura == '') &&(vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago == vCampospago_validar.vPendPagoClient && vCampospago_validar.vPendPagoClient == vCampospago_validar.vPendPagarCob) && this.mensaje==''){
      this.mensaje = "E|mp|El monto a pagar es igual a la reserva pendiente de la cobertura.";
    }else if ((vCampospago_validar.vReembolso != 2  && vCampospago_validar.vfactura == '') && (vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagoClient) && this.mensaje==''){
      this.mensaje = "A|mp|El monto a pagar es menor al pendiente por pagar del beneficiario.";
    }
    */
    
  }

  async validarbd() {
    console.log('inicio');
    let sdata = await this.service.Validaciones_Coberturas(this.FiltroValidar[0]);
    console.log('resultado');
    console.log(sdata);
    return sdata;
  }

   Validaciones_Muerte(vCampospago_validar: Campospago_validar){//sclient : string , tipoclient :string, Factura : string, FinAnalisis : string , TipoPago : number, FormaPago : number, PendPagarCob: number, PendPagoFact: number,PendPagoClient: number, MontoPago: number){
     
    this.mensaje ='';
    
    if (vCampospago_validar.vTipoPago ==0 && this.mensaje==''){
      this.mensaje = "E|tp|Seleccione un tipo de pago.";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago ==0 && this.mensaje==''){
      this.mensaje = "E|fp|Seleccione una forma de pago.";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago == 10 && vCampospago_validar.vbanco== ''&& this.mensaje==''){
      this.mensaje = "E|fp|No existe un banco asociado al beneficiario.";
      return this.mensaje;

    }else if (vCampospago_validar.vFormaPago == 10 && vCampospago_validar.vnroCuenta==''&& this.mensaje==''){
      this.mensaje = "E|fp|No existe un número de cuenta asociado al beneficiario.";
      return this.mensaje;

    }else if (vCampospago_validar.vMontoPago < 1  && this.mensaje==''){
      this.mensaje = "E|mp|Ingrese el importe a pagar.";
      return this.mensaje;

    }

   //********VALIDACIONES PERSONA NATURA****************************
    ////else if((vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagarCob) && this.mensaje==''){
    ////  this.mensaje = "E|mp|No se puede hacer pago total porque tiene reserva por pagar.";
    ////}

    /*
    else if ((vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagoClient) && this.mensaje==''){
      this.mensaje = "E|mp|El monto a pagar no puede ser menor al pendiente por pagar del beneficiario ("+ vCampospago_validar.vPendPagoClient +")";
      return this.mensaje;

    }else if ((vCampospago_validar.vTipoPago == 11 && vCampospago_validar.vMontoPago > vCampospago_validar.vPendPagoClient) && this.mensaje==''){
      this.mensaje = "E|mp|El monto a pagar no puede ser mayor al pendiente por pagar del beneficiario ("+vCampospago_validar.vPendPagoClient +")";
      return this.mensaje;

    }
    else if ((vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago > vCampospago_validar.vPendPagoClient) && this.mensaje==''){   
      this.mensaje = "E|mp|El monto a pagar no puede ser mayor al pendiente por pagar del beneficiario ("+ vCampospago_validar.vPendPagoClient +")";
      return this.mensaje;

    }
    */
      //si no hay errores
     return this.mensaje;
    /*
      if (this.mensaje ==''){

        this.FiltroValidar[0]= {
          P_NCLAIM : parseInt(this.siniestro),
          P_NCASE : parseInt(this.caso),
          P_NCOVER : this.tipoCobertura,   
          P_SCLIENT : vCampospago_validar.vsclient,
          P_REEMBOLSO: vCampospago_validar.vReembolso,
          P_NUMFACT : vCampospago_validar.vfactura,
          P_NOPER_TYPE : vCampospago_validar.vTipoPago,
          P_NAMOUNT : vCampospago_validar.vMontoPago,
        }

        let vdata = await this.validarbd();
        this.salidaValidaciones[0] = vdata[0]; 
        console.log(vdata);      
        if (this.salidaValidaciones.length > 0){ 
          if(this.salidaValidaciones[0].STATUS == '1'){
            this.mensaje = this.salidaValidaciones[0].MENSAJE;
            return this.mensaje;  
          }
        }
      */

        /*
        this.service.Validaciones_Coberturas(this.FiltroValidar[0]).subscribe(
           s => {        
            this.salidaValidaciones = s;
            console.log('VALIDACIONES: '); 
            console.log(this.salidaValidaciones); 

            if (this.salidaValidaciones.length > 0){ 
              if(this.salidaValidaciones[0].STATUS == '1'){
                this.mensaje = this.salidaValidaciones[0].MENSAJE;
                return this.mensaje;
              }
            }
            
          },
          e => {
            console.log(e);
            //dialogRefLoad.close();
          });
          
      }*/
    
    
    
    ////else if ((vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago == vCampospago_validar.vPendPagoClient && vCampospago_validar.vPendPagoClient == vCampospago_validar.vPendPagarCob) && this.mensaje==''){
    ////  this.mensaje = "E|mp|El monto a pagar es igual a la reserva pendiente de la cobertura.";
    ////}
    ////else if ((vCampospago_validar.vTipoPago == 10 && vCampospago_validar.vMontoPago < vCampospago_validar.vPendPagoClient) && this.mensaje==''){
    ////  this.mensaje = "A|El monto a pagar es menor al pendiente por pagar del beneficiario.";
    ////}
   
  }

  EnviarPago(sFiltroProcesoPago: FiltroProcesoPago){
   //SwalCarga();
    this.FiltroProcesoPagoEnvio[0]= sFiltroProcesoPago;
    console.log(this.FiltroProcesoPagoEnvio);
    //this.reference.close(true);
    
    this.service.InsertarLiquidacionSoat(this.FiltroProcesoPagoEnvio).subscribe(
      s => { 
        this.salidaProcesoPago = s;
        console.log(s);
        //Swal.close();
        if (this.salidaProcesoPago){ 
              if(this.salidaProcesoPago.STATUS == ''){
                
                Swal.fire('Información','Proceso de pago se realizo correctamente', 'success');    
                this.reference.close(true);
            
              }else{
                Swal.fire('Error',this.salidaProcesoPago.MENSAJE, 'error');
               
              }
              this.BtnDisabled1 = false;
              this.BtnDisabled2 = false;
        }
       
      },
      e => {
        console.log(e);
        //Swal.close();
        //dialogRefLoad.close();
        this.BtnDisabled1 = false;
      });

  
  } 

  EnviarPagoMuerte(sFiltroProcesoPago: FiltroProcesoPago[]){
    //SwalCarga();
    
    console.log(sFiltroProcesoPago);
    this.service.InsertarLiquidacionSoat(sFiltroProcesoPago).subscribe(
      s => { 
        this.salidaProcesoPago = s;
        console.log(s);
        //Swal.close();
        if (this.salidaProcesoPago){ 
              if(this.salidaProcesoPago.STATUS == ''){
                Swal.fire('Información','Proceso de pago se realizo correctamente', 'success'); 
                this.reference.close(true);   

              }else{
                Swal.fire('Error',this.salidaProcesoPago.MENSAJE, 'error');
               
              }
              this.BtnDisabled2 = false;
        }
        
      },
      e => {
        console.log(e);
        //Swal.close();
        //dialogRefLoad.close();
        this.BtnDisabled2 = false;
      });
  } 
 

  Clear_Inputs(){
    //setear variables, listas y campos del Modal
    this.tipoDocumento = "";
    this.nroDocumento = "";
    this.codDiagnostico = "";
    this.txtDiagnostico = "";
    this.especialidad = "";
    this.idBanco = "";
    this.banco = "";
    this.nroCuenta = "";
    this.totalFactura = 0;
    this.PendPagoClient = 0 ;
    this.txttipopago = "10";                
    this.txtformapago = "0";
    this.nroFactura = "";
    this.fechaEmisionFac = "";
    this.fechaRecibeFac = "";
    this.baseImponible = 0;
    this.igv = 0;
    this.totalComprobante = 0;
    this.pendpagofac = 0;
    this.FechaFinAnalisis = "";
    this.cant_facturas = 0;
    this.reembolso = 0;
  }

  formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
  }

  formato_fecha(fecha, formato) {

    const sdia = (((fecha.getDate()).toString()).length < 2 ?  ("0" + fecha.getDate()) :  fecha.getDate());
    const smes = (((fecha.getMonth() +1).toString()) .length < 2 ? ("0" + (fecha.getMonth() +1)) : (fecha.getMonth() +1) );    
    return (fecha.getFullYear() +  "-" +  smes + "-" + sdia );
  }

/*
  formatoFecha2(fecha) {
    //2023-07-11
     const sfecha = fecha.split("-");
     const sdia = sfecha[2];
     const smes = sfecha[1];
     const saño = sfecha[0];

    return (sdia + "/"  + smes + "/" + saño )
  }
*/

}