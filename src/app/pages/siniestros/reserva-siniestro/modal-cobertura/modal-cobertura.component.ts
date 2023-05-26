import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalBeneficiarioComponent } from '../modal-beneficiario/modal-beneficiario.component';


export class Beneficiario {
  codigoCliente: string;
  beneficiario: string;
  tipoDocumento: string;
  tipoBeneficiario: string;
  nroCuenta: string;
  cobertura: string;
  nroDocumento: string;
}

@Component({
  selector: 'app-modal-cobertura',
  templateUrl: './modal-cobertura.component.html',
  styleUrls: ['./modal-cobertura.component.scss']
})
export class ModalCoberturaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;

  beneficiarios: Beneficiario[] = [];
  datosTramitador = "1";

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.beneficiarios.push({
    //   codigoCliente: "", beneficiario: "", tipoDocumento: "", tipoBeneficiario: "", nroCuenta: "", cobertura: "", nroDocumento: ""
    // })
  }

  closeModal() {
    this.reference.close();
  }

  addRow(index: number) {
    if (this.beneficiarios[index].nroDocumento.replace(/ /g, "") == "") {
      Swal.fire('Información', 'Debe introducir el nro de documento del beneficiario', 'warning');
      return;
    } else {
      if(this.beneficiarios.length < 8){
        this.beneficiarios.push({
          codigoCliente: "", beneficiario: "", tipoDocumento: "", tipoBeneficiario: "", nroCuenta: "", cobertura: "", nroDocumento: ""
        })
      }else{
        return;
      }
    }
  }

  completarCampos(index: number) {
    if (this.beneficiarios[index].nroDocumento.replace(/ /g, "") != "") {
      this.beneficiarios[index].codigoCliente = "020001545259";
      this.beneficiarios[index].beneficiario = "Juan Pérez Mujica";
      this.beneficiarios[index].tipoDocumento = "DNI";
      this.beneficiarios[index].tipoBeneficiario = "Reclamanate";
      if(this.data == 1)  this.beneficiarios[index].cobertura = "1- Muerte";
      if(this.data == 2)  this.beneficiarios[index].cobertura = "2- Incapacidad Temporal";
      if(this.data == 3)  this.beneficiarios[index].cobertura = "3- Invalidez Permanente";
      if(this.data == 4)  this.beneficiarios[index].cobertura = "4- Gastos Médicos";
      if(this.data == 5)  this.beneficiarios[index].cobertura = "5- Gastos de Sepelio";      
    }
  }


  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((benef) => {
      console.log(benef);
    });
  }


}
