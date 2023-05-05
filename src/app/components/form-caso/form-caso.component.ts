import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaSiniestroComponent } from 'src/app/pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import Swal from 'sweetalert2';

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

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  buscador(){
    if(!this.tipoForm){
      this.showBotones = true
    }
  }

  consultaSiniestro() {
    const modalRef = this.modalService.open(ConsultaSiniestroComponent,  { windowClass : "my-class"});
    modalRef.componentInstance.reference = modalRef;
    //modalRef.componentInstance.data = data;
    modalRef.result.then((Interval) => {
    });
  }

  tabControl(index:number){
    this.tipoTab = index
    if(this.tipoTab == 1){
      this.declararActive = 'active'
      this.modificarActive = ''
      this.tituloTratamiento.emit(true);
    }
    if(this.tipoTab == 2){
      this.declararActive = ''
      this.modificarActive = 'active'
      this.tituloTratamiento.emit(false);
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
    this.showBotones = true 
    this.tipoTab = 0;
    this.modificarActive = '';
    this.declararActive = '';
  }

  

}
