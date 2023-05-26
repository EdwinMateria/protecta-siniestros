import { Component, OnInit, Input } from '@angular/core';
import { Beneficiario } from '../modal-cobertura/modal-cobertura.component';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuevoBeneficiarioComponent } from '../modal-nuevo-beneficiario/modal-nuevo-beneficiario.component';

@Component({
  selector: 'app-modal-beneficiario',
  templateUrl: './modal-beneficiario.component.html',
  styleUrls: ['./modal-beneficiario.component.scss']
})
export class ModalBeneficiarioComponent implements OnInit {

  @Input() public reference: any;
  beneficiarios: Beneficiario[] = [];
  buscador = "";
  selectBeneficio =  new Beneficiario();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  closeModal(buscador?:any) {
    this.reference.close(this.selectBeneficio);
  }

  llenarBeneficiarios(){
    this.beneficiarios.push({
      codigoCliente: "123456789", beneficiario: "BENEFICIARIO 1", tipoDocumento: "1", tipoBeneficiario: "2", nroCuenta: "123", cobertura: "", nroDocumento: ""
    });
    this.beneficiarios.push({
      codigoCliente: "123456789", beneficiario: "BENEFICIARIO 2", tipoDocumento: "1", tipoBeneficiario: "2", nroCuenta: "123", cobertura: "", nroDocumento: ""
    });
    this.beneficiarios.push({
      codigoCliente: "123456789", beneficiario: "BENEFICIARIO 3", tipoDocumento: "1", tipoBeneficiario: "2", nroCuenta: "123", cobertura: "", nroDocumento: ""
    });
    this.beneficiarios.push({
      codigoCliente: "123456789", beneficiario: "BENEFICIARIO 4", tipoDocumento: "1", tipoBeneficiario: "2", nroCuenta: "123", cobertura: "", nroDocumento: ""
    });
    this.beneficiarios.push({
      codigoCliente: "123456789", beneficiario: "BENEFICIARIO 5", tipoDocumento: "1", tipoBeneficiario: "2", nroCuenta: "123", cobertura: "", nroDocumento: ""
    });
  }

  buscadorBeneficiario(){
    if (this.buscador.replace(/ /g, "") == "") {
      Swal.fire('Información', 'Debe introducir el nro de documento del beneficiario', 'warning');
      return;
    }else{
      this.llenarBeneficiarios();
    }
  }

  limpiarBeneficiario(){
    this.buscador = "";
    this.beneficiarios = [];
  }

  openBeneficiario(){
    const modalRef = this.modalService.open(ModalNuevoBeneficiarioComponent,  { windowClass : "my-class", backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((Interval) => {
      this.closeModal('a');
    });
  }

  selectBeneficiario(beneficiario: Beneficiario){
    this.selectBeneficio = beneficiario;
  }

}
