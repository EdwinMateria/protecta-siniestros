import { Component, OnInit, Input } from '@angular/core';
import { Beneficiario } from '../modal-cobertura/modal-cobertura.component';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuevoBeneficiarioComponent } from '../modal-nuevo-beneficiario/modal-nuevo-beneficiario.component';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { ClaimBenefParamRequest } from 'src/app/core/models/claimBenefParamRequest';
import { BeneficiariesVM, ClaimBenefParamResponse } from 'src/app/core/models/claimBenefParamResponse';

@Component({
  selector: 'app-modal-beneficiario',
  templateUrl: './modal-beneficiario.component.html',
  styleUrls: ['./modal-beneficiario.component.scss']
})
export class ModalBeneficiarioComponent implements OnInit {

  @Input() public reference: any;
  beneficiarioResponse = new ClaimBenefParamResponse();
  buscador = new ClaimBenefParamRequest();
  pagina = 1;
  listaBeneficiarios : BeneficiariesVM[]=[];
  beneficiarioSeleccion = new BeneficiariesVM()

  constructor(private modalService: NgbModal, public reserveService: ReserveService) { }

  ngOnInit(): void {
  }

  closeModal(json?:any) {
    this.reference.close(json);
  }

  buscadorBeneficiario(){
    if (this.buscador.SMATERNAL_LASTNAME.replace(/ /g, "") == "" && this.buscador.SPATERNAL_LASTNAME.replace(/ /g, "") == "" && this.buscador.SNAME.replace(/ /g, "") == "" && this.buscador.SNRODOCUMENT.replace(/ /g, "") == "") {
      Swal.fire('Información', 'Debe llenar al menos un campo.', 'warning');
      return;
    }else{
      Swal.showLoading()
      this.reserveService.BusquedaBeneficiario(this.buscador).subscribe(
        res =>{
          Swal.close()
          this.beneficiarioResponse = res;
          this.listaBeneficiarios = this.beneficiarioResponse.ListBeneficiaries?.slice(0,9);
        },
        err => {
          Swal.close();
          console.log(err);
        }
      )
    }
  }

  limpiarBeneficiario(){
    this.buscador = new ClaimBenefParamRequest()
    this.beneficiarioResponse = new ClaimBenefParamResponse()
  }

  openBeneficiario(){
    const modalRef = this.modalService.open(ModalNuevoBeneficiarioComponent,  { windowClass : "my-class", backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((json) => {
      this.closeModal(json);
    });
  }

  selectBeneficiario(beneficiario: BeneficiariesVM){
    this.beneficiarioSeleccion = beneficiario;
  }

  changePagina(event:any){
    this.pagina = event;
    let inicio = (this.pagina - 1) * 10;
    let fin = inicio + 9;
    this.listaBeneficiarios = this.beneficiarioResponse.ListBeneficiaries?.slice(inicio , fin);
  }

  agregarBeneficiario(){
    if(this.beneficiarioSeleccion.SCODE == null || this.beneficiarioSeleccion.SCODE == "" ||  this.beneficiarioSeleccion.SCODE == undefined){
      Swal.fire('Información', 'Debe seleccionar un beneficiario.','warning');
      return;
    }else{
      this.reference.close(this.beneficiarioSeleccion);
    }
  }

}
