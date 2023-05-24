import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tratamiento-caso-siniestro',
  templateUrl: './tratamiento-caso-siniestro.component.html',
  styleUrls: ['./tratamiento-caso-siniestro.component.scss']
})
export class TratamientoCasoSiniestroComponent implements OnInit {

  tipoTab = 1;
  tipoTabForm = 0;
  registroActive = 'active';
  consultaActive = '';
  tituloState = false;

  formSiniestro = false;

  constructor() { }

  ngOnInit(): void {
  }

  getActiveRegimiento(indice) {
    if (indice === 0) {
      return 'active'
    } else {
      return ''
    }
  }

  tabControl(index:number){
    this.tipoTab = index
    if(this.tipoTab == 1){
      this.registroActive = 'active'
      this.consultaActive = ''
    }else{
      //  2
      this.registroActive = ''
      this.consultaActive = 'active';
      this.tipoTabForm = 2
    }
    this.tituloState = false
  }

  getvalueTitulo(state:any){
    this.tituloState = state
    if(!state){
      //rechazar siniestro
      this.tabControl(2);
    }else{
      this.registroActive = 'active'
      this.consultaActive = ''
      //this.tipoTab = 3;
    }
  }

  estadoFormSiniestro(estado:any){
    this.tipoTab = 3;
    this.formSiniestro = estado
  }

  cancelSiniestro(estado:any){
    if(estado){
      this.tabControl(2);
    }
  }

}
