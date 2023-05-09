import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaSiniestroComponent } from 'src/app/pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import Swal from 'sweetalert2';

export class TratamientoCaso{
  certificado : string;
  nroPlaca: string;
  inicioVigencia:string;
  finVigencia:string;
  contratante:string;
  documentoContratante:string;
  nombreConductor: string;
  documentoConductor: string;
  ubicacion:string;
  referencia:string;
  delegacion:string;
  observacion:string;
  fechaOcurrencia:any;
  horaOcurrencia:any;
  fechaNacimiento:any;
}

@Component({
  selector: 'app-form-caso',
  templateUrl: './form-caso.component.html',
  styleUrls: ['./form-caso.component.scss']
})
export class FormCasoComponent implements OnInit {

  @Input() tipoForm = true;
  showBotones = false;
  declararActive = '';
  modificarActive = '';
  tipoTab = 0;
  @Output() tituloTratamiento = new EventEmitter<boolean>();
  stateTituloSiniestro = 2;

  //RESULTADO
  tratamientoCaso = new TratamientoCaso();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  buscador(){
    if(!this.tipoForm){
      this.tratamientoCaso.nroPlaca = "2676"
      this.showBotones = true
      this.llenarTratamiento();
    }else{
      this.llenarTratamiento();
    }
  }

  llenarTratamiento(){
    this.tratamientoCaso.certificado = "0";
    this.tratamientoCaso.nroPlaca = "WR4-567";
    this.tratamientoCaso.inicioVigencia = "25/04/2022";
    this.tratamientoCaso.finVigencia = "25/04/2023";
    this.tratamientoCaso.contratante = "0200018143 - Escajadillo Chamorro Miguel Angel";
    this.tratamientoCaso.documentoContratante = "DNI - 45348029";
    this.tratamientoCaso.nombreConductor = "Pedro Suarez M";
    this.tratamientoCaso.documentoConductor = "44047021";
    this.tratamientoCaso.ubicacion = "Calle Chinchón 508 - San Isidro";
    this.tratamientoCaso.referencia = "Cruce con Petit Thouars";
    this.tratamientoCaso.delegacion = "Comisaría Santa Rosa";
    this.tratamientoCaso.observacion = "El siniestro tiene que ser evaluado";
  }

  consultaSiniestro() {
    const modalRef = this.modalService.open(ConsultaSiniestroComponent,  { windowClass : "my-class"});
    modalRef.componentInstance.reference = modalRef;
    //modalRef.componentInstance.data = data;
    modalRef.result.then((Interval) => {
    });
  }

  rechazarSiniestro(){
    Swal.fire({
      title: 'Información',
      text: "¿Deseas rechazar el caso del siniestro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      
      if(result.isConfirmed){
        this.declararActive = 'active'
        this.modificarActive = ''
        this.tituloTratamiento.emit(true);
        this.stateTituloSiniestro = 3
        this.tipoTab = 1;
      }
    })
  }

  tabControl(index:number, stateTituloSiniestro?:number){
    this.tipoTab = index
    if(this.tipoTab == 1){
      if(stateTituloSiniestro == 1){
        this.stateTituloSiniestro = 1
      }else if(stateTituloSiniestro == 2){
        this.stateTituloSiniestro = 2
      }
      
      this.declararActive = 'active'
      this.modificarActive = ''
      this.tituloTratamiento.emit(true);
    }
    if(this.tipoTab == 2){
      this.declararActive = ''
      this.modificarActive = 'active'
      this.tituloTratamiento.emit(false);
      this.tipoTab = index
    }
  }

  rechazarCaso(){
    Swal.fire({
      title: 'Información',
      text: "¿Deseas rechazar el caso del siniestro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      
      if(result.isConfirmed){
        this.tipoTab = 3;
        this.tituloTratamiento.emit(false);
      }
    })
  }

  opcionVolver(){
    this.tipoTab = 0;
    this.modificarActive = '';
    this.declararActive = '';
    this.stateTituloSiniestro = 2;
    this.tituloTratamiento.emit(false);
    this.tratamientoCaso = new TratamientoCaso();
    this.showBotones = false;
  }

  siniestroCancel(cancel:boolean){
    if(cancel){
      this.opcionVolver();
    }
  }

  saveCaso(){
    if(this.tratamientoCaso.fechaNacimiento == null || this.tratamientoCaso.fechaNacimiento == null 
      || this.tratamientoCaso.horaOcurrencia == null){
        Swal.fire('Información','Debe completar todos los campos','warning');
        return;
      }
      else{
        this.tratamientoCaso.nroPlaca = "2676"
        Swal.fire({
          title: 'Información',
          text: "Se declaró el caso correctamente: 2676. ¿Desea declarar los siniestros?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'De acuerdo',
          cancelButtonText: 'No',
          reverseButtons: true
        }).then((result) => {
          
          if(result.isConfirmed){
            this.tipoForm = false;
            this.showBotones = true
            this.tabControl(1,2);
          }
        })
      }
  }

}
