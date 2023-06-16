import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalGastosCoberturaComponent } from './modal-gastos-cobertura/modal-gastos-cobertura.component';
import { DatosCasoSiniestro } from '../models/Liquidacion.model';
import { LiquidacionService } from 'src/app/services/LiquidacionService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//import * as internal from 'stream';

export class Movimiento{
  NCLAIM : string;
  NCOVER : number;
  DESC_COBERTURA : string;
  PENDIENTES : number;
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
  NCERTIF : number;
  SCERTYPE : number;
  NBRANCH : number;
  NPRODUCT : number;
  SBRANCHT : string;
  NCLAIM : number;
  NCASE_NUM : number;
  NDEMAN_TYPE : number;
  NOPT_CLAITYP : number;
  SKEY : string;
}

export class PendientePago{
  NCLAIM : string;
  NCASE: string;
}

@Component({
  selector: 'app-gastos-curacion',
  templateUrl: './gastos-curacion.component.html',
  styleUrls: ['./gastos-curacion.component.scss']
})
export class GastosCuracionComponent implements OnInit {

  caso = "";
  siniestro = "";
  cantBenef = 0;

  movimientos: Movimiento[]=[];
  detalle: Detalle = new Detalle;
  mostrarTable= false;

  dataSourceLiquidacion = new Detalle();

  movimientosPago: Movimiento[]=[];

  pendientePagoInput = new PendientePago();

  constructor(private modalService: NgbModal,
              private service: LiquidacionService) { }
    

  ngOnInit(): void {
    //this.config.data = { Titulo: 'Generación de Factura de Abonos' };
    //GASTOS DE CURACION
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Gastos de curación", PENDIENTES: 548.00, DATO_ADICIONAL: "3735195", NCOVER : 1, seleccion : false, id:1
    // });
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Gastos de curación", PENDIENTES: 1000.85, DATO_ADICIONAL: "3735195", NCOVER : 1, seleccion : false, id:2
    // })
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Gastos de curación", PENDIENTES: -300.48, DATO_ADICIONAL: "Ajuste 105", NCOVER : 1, seleccion : false, id:3
    // })
    // //GASTOS DE SEPELIO
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Gastos de sepelio", PENDIENTES: 2000.05, DATO_ADICIONAL: "", NCOVER : 2, seleccion : false, id:4
    // })
    // //INVALIDEZ PERMANENTE
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Invalidez permanente", PENDIENTES: 18000, DATO_ADICIONAL: "", NCOVER : 3, seleccion : false, id:5
    // })
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Invalidez permanente", PENDIENTES: 10000.95, DATO_ADICIONAL: "", NCOVER : 3, seleccion : false, id:6
    // })
    // //INVALIDEZ TEMPORAL
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Invalidez temporal", PENDIENTES: 500, DATO_ADICIONAL: "", NCOVER : 4, seleccion : false, id:7
    // })
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Invalidez temporal", PENDIENTES: 300, DATO_ADICIONAL: "", NCOVER : 4, seleccion : false, id:8
    // })
    // //MUERTE
    // this.movimientos.push({
    //   NCLAIM: "44573", DESC_COBERTURA: "Muerte", PENDIENTES: 198000, DATO_ADICIONAL: "", NCOVER : 5, seleccion : false, id:9
    // })
  }


  buscadorMovimientos(){
    //if(this.caso.replace(/ /g, "") == "" || this.siniestro.replace(/ /g, "") == ""){
    if(this.caso == "" || this.siniestro == ""){
      Swal.fire('Información', 'Coloque el caso y el nro. de siniestro', 'warning');
      this.mostrarTable = false;
      this.detalle = new Detalle();
      return;
    }else{
      
      const datosCasoSiniestro = new DatosCasoSiniestro();
      datosCasoSiniestro.ncase = this.caso;
      datosCasoSiniestro.nclaim = this.siniestro;

      this.service.RetornarDatosCasoSiniestro(datosCasoSiniestro).subscribe(
        s => {
          console.log(s);
          this.dataSourceLiquidacion = s;

          if (this.dataSourceLiquidacion.NCODERROR == "1"){
            Swal.fire('Error', this.dataSourceLiquidacion.SMESSAGEERROR, 'error');
            this.mostrarTable = false;
            return;
          }else{
            if (this.dataSourceLiquidacion.SSTACLAIM == "1" || this.dataSourceLiquidacion.SSTACLAIM == "5" || this.dataSourceLiquidacion.SSTACLAIM == "7"){ 
               Swal.fire('No se puede pagar este Siniestro. Estado del siniestro: ' + this.dataSourceLiquidacion.ESTADO_SINIESTRO);
               this.mostrarTable = false;
               this.detalle = new Detalle();
               return;
             }else{
                if (this.dataSourceLiquidacion.NLOC_RESERV <= 0){ 
                  Swal.fire('Información','El siniestro no tiene reserva','error');
                  this.mostrarTable = false;
                  this.detalle = new Detalle();
                  return;
                }else{
                  this.detalle.NCODERROR = this.dataSourceLiquidacion.NCODERROR;
                  this.detalle.SMESSAGEERROR = this.dataSourceLiquidacion.SMESSAGEERROR;
                  this.detalle.SSTACLAIM = this.dataSourceLiquidacion.SSTACLAIM;
                  this.detalle.ESTADO_SINIESTRO = this.dataSourceLiquidacion.ESTADO_SINIESTRO;
                  this.detalle.NPOLICY = this.dataSourceLiquidacion.NPOLICY;
                  this.detalle.DOCCURDAT = this.dataSourceLiquidacion.DOCCURDAT;
                  this.detalle.HORAOCURRENCIA = this.dataSourceLiquidacion.HORAOCURRENCIA;
                  this.detalle.SCLIENAME = this.dataSourceLiquidacion.SCLIENAME;
                  this.detalle.UIT = this.dataSourceLiquidacion.UIT;
    
                  //buscamos los movimientos
                  // this.pendientePagoInput.NCLAIM = "34203"
                  this.pendientePagoInput.NCLAIM = this.siniestro;
                  this.pendientePagoInput.NCASE = this.caso;
                  this.buscarCoberturasPendientePago(this.pendientePagoInput);  //datosCasoSiniestro.nclaim
                  //this.mostrarTable = true;
                }
              }            
          }  
          //dialogRefLoad.close();
        },
        e => {
          console.log(e);
          //dialogRefLoad.close();
        });
    }
  }

  buscarCoberturasPendientePago(pendientePagoInput : PendientePago){

    this.service.RetornarListaSiniPendPago(pendientePagoInput).subscribe(
      s => {
        
        this.movimientos = s;
        console.log(this.movimientos);
        if (this.movimientos.length > 0){
            this.mostrarTable = true;
        }else{
          Swal.fire('Información','Este siniestro no tiene pagos pendientes', 'error');
          this.mostrarTable = false;
          return;
        }
      },
      e => {
        console.log(e);
        //dialogRefLoad.close();
      });

  }

  seleccionChechbox(movimiento: Movimiento){
    let movTemp : Movimiento[]=[];

    if(movimiento.SELECCION == true){

      this.movimientos.forEach(x => {
        if(x.NCOVER == movimiento.NCOVER){
          x.SELECCION = true;
          x.NCASENUM = this.caso;
          this.movimientosPago.push(x);
          console.log(this.movimientosPago);
        }else{
          x.SELECCION = false
          this.movimientosPago = this.movimientosPago.filter(m => m.NCOVER != x.NCOVER);
          console.log(this.movimientosPago);
        }
      })
    }else{
      //this.movimientosPago = this.movimientosPago.filter(x => x.id != movimiento.id)
      this.movimientosPago.forEach(x => {
        x.SELECCION = false
      });
      this.movimientosPago = [];
    }

  }

  procesoPago(){
    if(this.movimientosPago.length == 0){
      Swal.fire('Información','Debe seleccionar una cobertura', 'warning');
      return;
    }else{
      if(this.movimientosPago[0].NROBENEF == 0){
        Swal.fire('Información','La cobertura seleccionada no tiene beneficiarios', 'warning');
        return;
      }else{
        const modalRef = this.modalService.open(ModalGastosCoberturaComponent,  { windowClass : "my-class"});
        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.data = this.movimientosPago;
        modalRef.componentInstance.dataSourceLiquidacion = this.dataSourceLiquidacion
        modalRef.result.then((Interval) => {
      });
      }
    }
  }

}
