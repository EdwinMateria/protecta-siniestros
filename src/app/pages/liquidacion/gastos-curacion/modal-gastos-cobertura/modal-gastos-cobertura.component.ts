import { Component, OnInit, Input } from '@angular/core';
import { Movimiento } from '../gastos-curacion.component';

@Component({
  selector: 'app-modal-gastos-cobertura',
  templateUrl: './modal-gastos-cobertura.component.html',
  styleUrls: ['./modal-gastos-cobertura.component.scss']
})
export class ModalGastosCoberturaComponent implements OnInit {

  tipoCobertura = 0
  @Input() public reference: any;
  @Input() public data: Movimiento[];
  titulo = "";
  baseImponible = 0;
  totalFactura = 0;
  igv = "";
  totalComprobante = "";

  constructor() { }

  ngOnInit(): void {
    this.inicializadorModal()
  }

  closeModal() {
    this.reference.close();
  }

  inicializadorModal(){
    //TITULO MODAL
    this.tipoCobertura = this.data[0].tipoCobertura;
    if(this.tipoCobertura == 1) this.titulo = "Gastos de curación";
    if(this.tipoCobertura == 2) this.titulo = "Gastos de sepelio";
    if(this.tipoCobertura == 3) this.titulo = "Invalidez permanente";
    if(this.tipoCobertura == 4) this.titulo = "Invalidez temporal";
    if(this.tipoCobertura == 5) this.titulo = "Muerte";

    //SUMA TOTAL
    if(this.tipoCobertura == 1 || this.tipoCobertura == 2){
      this.baseImponible = this.data.reduce(function (acc, obj) { return acc + obj.importe; }, 0);
      this.igv = (this.baseImponible * 0.18 ).toFixed(2);
      this.totalComprobante = (this.baseImponible + Number(this.igv)).toFixed(2);
      this.totalFactura = this.baseImponible;
    }

    if(this.tipoCobertura ==  5){
      this.baseImponible = this.data.reduce(function (acc, obj) { return acc + obj.importe; }, 0);
    }


  }

}
