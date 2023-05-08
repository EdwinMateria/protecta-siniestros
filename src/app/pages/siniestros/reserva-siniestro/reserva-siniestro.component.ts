import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

export class ReservaCaso{
  poliza :string;
  certificado :string;
  afectado :string;
  fechaOcurrencia: string;
  horaOcurrencia:string;
  tipoAtencion:string;
  UIT: string;
}
@Component({
  selector: 'app-reserva-siniestro',
  templateUrl: './reserva-siniestro.component.html',
  styleUrls: ['./reserva-siniestro.component.scss']
})
export class ReservaSiniestroComponent implements OnInit {

  tipoTab = 1;
  registroActive = 'active';
  consultaActive = '';
  siniestros = [];
  caso = "";
  siniestro = 0;

  //RESULT
  reservaCaso : ReservaCaso = new ReservaCaso();
  showTable = false;

  constructor() { }

  ngOnInit(): void {
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

  buscadorSiniestro(){
    if(this.caso == "1"){
      this.siniestros.push({id: "1", nombre:"456"});
      this.siniestros.push({id: "2", nombre:"457"});
    }else{
      this.siniestros = [];
      this.siniestro = 0;
      this.reservaCaso = new ReservaCaso();
      Swal.fire('Información', 'El caso no tiene siniestros asociados', 'warning');
      this.showTable = false;
      return;
    }
    
  }

  buscadorGlobal(){
    if(this.siniestro != 0){
      this.reservaCaso.poliza = "12548";
      this.reservaCaso.certificado = "0";
      this.reservaCaso.afectado = "Luis Escobar Suarez";
      this.reservaCaso.fechaOcurrencia = "31/12/2023";
      this.reservaCaso.horaOcurrencia = "17:00:00";
      this.reservaCaso.tipoAtencion = "1";
      this.reservaCaso.UIT = "4,950";
      this.showTable = true;
    }
  }

}
