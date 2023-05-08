import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

export class Movimiento{
  nroSiniestro:string;
  beneficiario:string;
  cobertura:string;
  tipoMovimiento:string;
  importe:string;
  datoAdicional:string;
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

  constructor() { }

  ngOnInit(): void {
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Inicio reserva", importe: "548", datoAdicional: "3735195"
    });
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Ajuste", importe: "1000", datoAdicional: "3735195"
    })
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Clinica Internacional", cobertura: "Gastos de curación", tipoMovimiento: "Ajuste", importe: "-300", datoAdicional: "Ajuste 105"
    })
    this.movimientos.push({
      nroSiniestro: "44573", beneficiario: "Funeraria Jardines", cobertura: "Gastos de sepelio", tipoMovimiento: "Ajuste", importe: "2000", datoAdicional: ""
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

}
