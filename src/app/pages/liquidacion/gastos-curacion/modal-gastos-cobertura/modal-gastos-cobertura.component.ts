import { Component, OnInit, Input } from '@angular/core';
import { Movimiento } from '../gastos-curacion.component';
import { LiquidacionService } from 'src/app/services/LiquidacionService';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class DatosSiniestro{
  PNCLAIM : string;
  PNCOVER : number;
  PNCASE: string;
}

export class DatosBeneficiarios{
  PNCLAIM : string;
  PNCOVER : number;
  PCASENUM: string;
  PDOCCURDATE: Date;
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
}

export class SalidaBeneficiarios{
  NCLAIM : string;
  NCASE_NUM : number;
  SCLIENT: string;
  SSHORT_DES: string;
  SCLIENAME: number;
  NPARTICIP: number;
  UIT: number;
  NCAPITAL: number;
  NBANKEXT: string;
  NOMBRE_BANCO: string;
  SACCOUNT: string;
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
  fechaDenuncia = "";
  fechaApertura = "";
  codDiagnostico = "";
  especialidad = "";
  tipoCobertura = 0;
  banco = "";
  nroCuenta = "";
  nroFactura = "";
  fechaEmisionFac = "";
  fechaRecibeFac = "";
  tipoDocumento = "";
  nroDocumento = "";
  @Input() public reference: any;
  @Input() public data: Movimiento[];
  @Input() public beneficiario: SalidaBeneficiarios[];
  titulo = "";
  baseImponible = 0;
  totalFactura = 0;
  igv = "";
  totalComprobante = "";
  totalPagarMuerte = 0;

  constructor(private service: LiquidacionService,
              private modalService: NgbModal) { }

  datosPago: DatosPago = new DatosPago;
  datosPagoSalida: DatosPago = new DatosPago;
  datosSiniestro: DatosSiniestro = new DatosSiniestro;
  datosBeneficiarios: DatosBeneficiarios = new DatosBeneficiarios;
  tipoPago: TipoPago[] = [];
  formaPago: FormaPago[] = [];
  salidaBeneficiarios: SalidaBeneficiarios[] = [];
  salidaBeneficiarios2: SalidaBeneficiarios[] = [];
  objBeneficiario : SalidaBeneficiarios;
  fechaOcur = "";


  ngOnInit(): void {
    this.inicializadorModal()
  }

  closeModal() {
    this.reference.close();
  }

  inicializadorModal(){

    //llenamos las listas
    this.GetListaTipoPago();
    this.GetListaFormaPago();

    //TITULO MODAL
    this.tipoCobertura = this.data[0].NCOVER;
    console.log(this.tipoCobertura);
    this.titulo = this.data[0].DESC_COBERTURA;
    // if(this.tipoCobertura == 2) this.titulo = "Gastos de sepelio";
    // if(this.tipoCobertura == 3) this.titulo = "Invalidez permanente";
    // if(this.tipoCobertura == 4) this.titulo = "Invalidez temporal";
    // if(this.tipoCobertura == 5) this.titulo = "Muerte";

    this.siniestro = this.data[0].NCLAIM;
    this.caso = this.data[0].NCASENUM;

    this.datosSiniestro.PNCASE = "15"; //this.caso;
    this.datosSiniestro.PNCLAIM = "377193"; //this.siniestro;
    this.datosSiniestro.PNCOVER = 2; //this.tipoCobertura;
    this.tipoCobertura = 4;  //cobertura de prueba, borrar esta linea despues de probar
    this.titulo = "GASTOS DE CURACION";

    this.buscarDatosPago(this.datosSiniestro);
    //this.baseImponible = this.redondearDecimales(this.data[0].PENDIENTES,2);
    
    //SUMA TOTAL
    if(this.tipoCobertura == 4 || this.tipoCobertura == 5){
      //Obtenemos los beneficiarios
      const denuncia = "11/05/2023";
      const fechaOcurre = new Date(denuncia);
      this.datosBeneficiarios.PNCLAIM = "4064"; //this.siniestro;
      this.datosBeneficiarios.PNCOVER = 4; //this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = "1"; this.caso;    
      this.datosBeneficiarios.PDOCCURDATE = fechaOcurre;
      this.datosBeneficiarios.PPOLICY = "7000009280"; //this.poliza;
      this.ObtenerBeneficiarios(this.datosBeneficiarios);  
      //this.baseImponible = this.data.reduce(function (acc, obj) { return acc + obj.PENDIENTES; }, 0);
      this.baseImponible = this.redondearDecimales(this.data[0].PENDIENTES,2);
      this.igv = (this.baseImponible * 0.18 ).toFixed(2);
      this.totalComprobante = (this.baseImponible + Number(this.igv)).toFixed(2);
      this.totalFactura = this.baseImponible;
    }

    if(this.tipoCobertura == 2 || this.tipoCobertura == 3){
      //Obtenemos los beneficiarios
      const denuncia = "11/05/2023";
      const fechaOcurre = new Date(denuncia);
      this.datosBeneficiarios.PNCLAIM = "4064"; //this.siniestro;
      this.datosBeneficiarios.PNCOVER = 4; //this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = "1"; this.caso;    
      this.datosBeneficiarios.PDOCCURDATE = fechaOcurre;
      this.datosBeneficiarios.PPOLICY = "7000009280"; //this.poliza;
      this.ObtenerBeneficiarios(this.datosBeneficiarios);
      this.baseImponible = this.redondearDecimales(this.data[0].PENDIENTES,2);
      this.totalFactura = this.baseImponible;
    }

    if(this.tipoCobertura ==  1){
      //Obtenemos los beneficiarios
      const denuncia = "11/05/2023";
      const fechaOcurre = new Date(denuncia);
      this.datosBeneficiarios.PNCLAIM = "37466"; //this.siniestro;
      this.datosBeneficiarios.PNCOVER = 4; //this.tipoCobertura;
      this.datosBeneficiarios.PCASENUM = "1"; this.caso;    
      this.datosBeneficiarios.PDOCCURDATE = fechaOcurre;
      this.datosBeneficiarios.PPOLICY = "7590"; //this.poliza;
      this.ObtenerBeneficiariosMuerte(this.datosBeneficiarios);
      this.baseImponible = this.redondearDecimales(this.data.reduce(function (acc, obj) { return acc + obj.PENDIENTES; }, 0),2);
    }

  }

  redondearDecimales(numero, decimales) {
    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number(numero.toFixed(decimales));
    } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
  }

  buscarDatosPago(data : DatosSiniestro){
    
    this.service.ObtenerDatosGastosSepMed(data).subscribe(
      s => {
        console.log(s);
        this.datosPago = s;
        this.poliza = this.datosPago.NPOLICY;
        this.placa = "ABC 123";
        this.docSiniestrado = this.datosPago.SCLIENT;
        this.siniestrado = this.datosPago.SCLIENAME;
        this.fechaDenuncia = this.datosPago.FECHADECLARACION;
        this.fechaApertura = this.datosPago.FECHAAPERTURA;
        this.codDiagnostico = this.datosPago.SCODIGODIAGNOSTICO;
        this.especialidad = this.datosPago.SESPECIALIDAD;
        this.banco = this.datosPago.NOMBRE_BANCO;
        this.nroCuenta = this.datosPago.SACCOUNT;
        this.nroFactura = this.datosPago.NBILL;
        this.fechaEmisionFac = this.datosPago.FECHAEMISIONFACTURA;
        this.fechaRecibeFac = this.datosPago.FECHARECEPCIONFACTURA;
        
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
        }

        
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
    this.service.ObtenerBeneficiariosMuerte(data).subscribe(
      s => {        
        this.salidaBeneficiarios = s;
        // if(this.salidaBeneficiarios.length == 0){
        //   Swal.fire('La cobertura no tiene beneficiarios asociados');
        //   this.modalService.dismissAll();
        //   return;
        // }else{
          if (this.salidaBeneficiarios.length >0){
            this.tipoDocumento = this.salidaBeneficiarios[0].SSHORT_DES;
            this.nroDocumento = this.salidaBeneficiarios[0].SCLIENT;
            this.objBeneficiario = this.salidaBeneficiarios[0];
          }
        //}        
        console.log('Beneficiarios: '); 
        console.log(this.salidaBeneficiarios);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  ObtenerBeneficiariosMuerte(data : DatosBeneficiarios){
    this.service.ObtenerBeneficiariosMuerte(data).subscribe(
      s => {        
        this.salidaBeneficiarios = s;
        console.log('Salida longitud lista: ' + this.salidaBeneficiarios.length.toString());
        if (this.salidaBeneficiarios.length > 0){
          console.log(this.baseImponible);
          this.totalPagarMuerte = this.baseImponible / this.salidaBeneficiarios.length;
          console.log(this.totalPagarMuerte);
        }
        console.log(this.salidaBeneficiarios);        
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });
  }

  cambioBeneficiario(){

    const selectElement = document.getElementById("nomBeneficiarios") as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log(selectedValue);
    const tipoDoc = selectedValue.split("|")[0];
    const numDoc = selectedValue.split("|")[1];
    this.tipoDocumento = tipoDoc;
    this.nroDocumento = numDoc;

  }

  cambioTipoPago(){

  }
  
  cambioFormaPago(){
    const selectElement = document.getElementById("formaPago") as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if(selectedValue == "5"){
      Swal.fire('Información','Esta cambiando la forma de pago a Cheque.', 'warning');
    }

  }

  procesarPago(){
    const selectElementTipoPago = document.getElementById("formaPago") as HTMLSelectElement;
    const selectedValueTipoPago = selectElementTipoPago.value;
    const selectElementMontoPago = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueMontoPago = selectElementMontoPago.value;
    const selectElementTotalBenef = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueTotalBenef = selectElementTotalBenef.value;
    console.log(selectedValueTipoPago);
    console.log(selectedValueMontoPago);
    console.log(this.baseImponible);
    if(selectedValueTipoPago == "10" && Number(selectedValueMontoPago) > this.baseImponible){
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
    }
  }

  procesarPagoMuerte(){
    const selectElementTipoPago = document.getElementById("formaPago") as HTMLSelectElement;
    const selectedValueTipoPago = selectElementTipoPago.value;
    const selectElementMontoPago = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueMontoPago = selectElementMontoPago.value;
    const selectElementTotalBenef = document.getElementById("totalPago") as HTMLSelectElement;
    const selectedValueTotalBenef = selectElementTotalBenef.value;
    console.log(selectedValueTipoPago);
    console.log(selectedValueMontoPago);
    console.log(this.baseImponible);
    if(selectedValueTipoPago == "10" && Number(selectedValueMontoPago) > this.baseImponible){
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
    }
  }

}
