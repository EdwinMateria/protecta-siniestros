import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalCoberturaComponent } from './modal-cobertura/modal-cobertura.component';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { ClaimRequest } from 'src/app/core/models/claimRequest';
import { ClaimResponse } from 'src/app/core/models/claimResponse';
import { ClaimCaseDataRequest } from 'src/app/core/models/claimCaseDataRequest';
import { ClaimCoverResponse } from 'src/app/core/models/claimCoverResponse';

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
  siniestros : ClaimResponse[] = [{CODIGO : 0 , DESCRIPCION : 'SELECCIONE'}];
  claimRequest = new ClaimRequest();
  siniestro = 0;
  tiposAtencion = this.reserveService.GetComboTipoAtencion();

  //PRUEBA
  arrayChech : boolean[]=[];

  //RESULT
  reservaCaso : ClaimCoverResponse = new ClaimCoverResponse();
  showTable = false;

  constructor(private modalService: NgbModal, public reserveService: ReserveService) { }

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
    this.claimRequest = new ClaimRequest();
    this.siniestro = 0;
    this.showTable = false

    this.arrayChech = [
      false, false, false, false, false
    ]
  }

  resetBuscado(){
    this.showTable = false;
    this.siniestros = [];
    this.reservaCaso = new ClaimCoverResponse();
    this.siniestro = 0;
  }

  buscadorSiniestro(){
    this.resetBuscado();
    if(this.claimRequest == new ClaimRequest() || this.claimRequest.NCASE == null){
      Swal.fire('Información', 'Debe ingresar un nro. caso válido.', 'warning');
      this.siniestros.push({CODIGO : 0 , DESCRIPCION : 'SELECCIONE'})
      return;
    }else{
      Swal.showLoading();
      this.reserveService.GetClaim(this.claimRequest).subscribe(
        res => {
          Swal.close();
          this.siniestros = res;
          if(res.length == 1){
            Swal.fire('Información','No se encontraron siniestros para el caso ingresado','warning');
            return;
          }else{
            // Si tiene solo un siniestro
            if(res.length == 2){
              this.siniestro = this.siniestros.find(x => x.CODIGO != 0).CODIGO;
              this.buscadorGlobal()
            }
          }
        },
        err => {
          Swal.close();
          console.log(err);
        }
      )
    }
  }

  buscadorGlobal(){
    if(this.siniestro != 0){
      Swal.showLoading()
      let data = new ClaimCaseDataRequest();
      data.NCLAIM = this.siniestro;
      data.NCASE = this.claimRequest.NCASE;
      this.reserveService.GetClaimCaseData(data).subscribe(
        res =>{
          Swal.close()
          this.showTable = true;
          this.reservaCaso = res;
        },
        err => {
          Swal.close()
          console.log(err);
        }
      )
    }
  }

  openModalCobertura(origen:number){
    const modalRef = this.modalService.open(ModalCoberturaComponent,  { windowClass : "my-class", backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = origen;
    modalRef.result.then((Interval) => {
      
    });
  }

  reserva(event:any, origen: number){
    if(event.target.checked){
      this.openModalCobertura(origen)
    }
  }


}
