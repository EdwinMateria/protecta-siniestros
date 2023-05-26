import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalGastosCoberturaComponent } from './modal-gastos-cobertura/modal-gastos-cobertura.component';

export class Movimiento{
  nroSiniestro:string;
  beneficiario:string;
  cobertura:string;
  tipoMovimiento:string;
  importe:number;
  datoAdicional:string;
  tipoCobertura:number;
  seleccion:boolean;
  id: number
}

export class Detalle{
  poliza : string;
  fechaOcurrencia: string;
  horaOcurrencia:string;
  siniestrado:string;
  UIT: string;
}

@Component({
  selector: 'app-gastos-curacion',
  templateUrl: './gastos-curacion.component.html',
  styleUrls: ['./gastos-curacion.component.scss']
})
export class GastosCuracionComponent implements OnInit {

  caso = "";
  siniestro = "";

  movimientos: Movimiento[]=[];
  detalle: Detalle = new Detalle;
  mostrarTable= false;

  movimientosPago: Movimiento[]=[];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    //GASTOS DE CURACION
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Inicio reserva", importe: 548, datoAdicional: "3735195", tipoCobertura : 1, seleccion : false, id:1
    });
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Ajuste", importe: 1000, datoAdicional: "3735195", tipoCobertura : 1, seleccion : false, id:2
    })
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Ajuste", importe: -300, datoAdicional: "Ajuste 105", tipoCobertura : 1, seleccion : false, id:3
    })
    //GASTOS DE SEPELIO
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Funeraria Jardines", cobertura: "Gastos de sepelio", tipoMovimiento: "Ajuste", importe: 2000, datoAdicional: "", tipoCobertura : 2, seleccion : false, id:4
    })
    //INVALIDEZ PERMANENTE
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Leva Palomino", cobertura: "Invalidez permanente", tipoMovimiento: "Inicio reserva", importe: 18000, datoAdicional: "", tipoCobertura : 3, seleccion : false, id:5
    })
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Alva Palomino", cobertura: "Invalidez permanente", tipoMovimiento: "Inicio reserva", importe: 10000, datoAdicional: "", tipoCobertura : 3, seleccion : false, id:6
    })
    //INVALIDEZ TEMPORAL
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Jose Palomino", cobertura: "Invalidez temporal", tipoMovimiento: "Inicio reserva", importe: 500, datoAdicional: "", tipoCobertura : 4, seleccion : false, id:7
    })
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Andrea Palomino", cobertura: "Invalidez temporal", tipoMovimiento: "Inicio reserva", importe: 300, datoAdicional: "", tipoCobertura : 4, seleccion : false, id:8
    })
    //MUERTE
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Varios", cobertura: "Muerte", tipoMovimiento: "Inicio reserva", importe: 198000, datoAdicional: "", tipoCobertura : 5, seleccion : false, id:9
    })
  }


  buscadorMovimientos(){
    if(this.caso.replace(/ /g, "") == "" || this.siniestro.replace(/ /g, "") == ""){
      Swal.fire('Información', 'Coloque el caso y el nro. de siniestro', 'warning');
      this.mostrarTable = false;
      this.detalle = new Detalle();
      return;
    }else{
      this.mostrarTable = true;
      this.detalle.poliza = "7003774321";
      this.detalle.fechaOcurrencia = "22/02/2023";
      this.detalle.horaOcurrencia = "11:00:00";
      this.detalle.siniestrado = "Leva Palomino Camila";
      this.detalle.UIT = "4.950"
    }
  }


  seleccionChechbox(movimiento: Movimiento){
    let movTemp : Movimiento[]=[];

    if(movimiento.seleccion == true){

      this.movimientos.forEach(x => {
        if(x.tipoCobertura == movimiento.tipoCobertura){
          x.seleccion = true;
          this.movimientosPago.push(x);
        }else{
          x.seleccion = false
          this.movimientosPago = this.movimientosPago.filter(m => m.id != x.id)
        }
      })
    }else{
      //this.movimientosPago = this.movimientosPago.filter(x => x.id != movimiento.id)
      this.movimientosPago.forEach(x => {
        x.seleccion = false
      });
      this.movimientosPago = [];
    }

  }

  procesoPago(){
    if(this.movimientosPago.length == 0){
      Swal.fire('Información','Debe seleccionar movimientos', 'warning');
      return;
    }else{
      const modalRef = this.modalService.open(ModalGastosCoberturaComponent,  { windowClass : "my-class"});
      modalRef.componentInstance.reference = modalRef;
      modalRef.componentInstance.data = this.movimientosPago;
      modalRef.result.then((Interval) => {
      });
    }
  }

}
