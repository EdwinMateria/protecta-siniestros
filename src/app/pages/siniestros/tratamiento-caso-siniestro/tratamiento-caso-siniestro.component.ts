import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tratamiento-caso-siniestro',
  templateUrl: './tratamiento-caso-siniestro.component.html',
  styleUrls: ['./tratamiento-caso-siniestro.component.scss']
})
export class TratamientoCasoSiniestroComponent implements OnInit {

  tipoTab = 1;
  registroActive = 'active';
  consultaActive = '';
  tituloState = false;

  constructor() { }

  ngOnInit(): void {
  }

  getActiveRegimiento(indice) {
    //await this.setVariableRegimen(regimen)
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
      this.registroActive = ''
      this.consultaActive = 'active'
    }
  }

  getvalueTitulo(state:any){
    console.log(state);
    this.tituloState = state
  }

}
