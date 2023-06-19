import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalCoberturaComponent } from './modal-cobertura/modal-cobertura.component';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { ClaimRequest } from 'src/app/core/models/claimRequest';
import { ClaimResponse } from 'src/app/core/models/claimResponse';
import { ClaimCaseDataRequest } from 'src/app/core/models/claimCaseDataRequest';
import { ClaimCoverResponse, ClaimDataCoverVM } from 'src/app/core/models/claimCoverResponse';
import { ClaimCoverTmpRequestBM } from 'src/app/core/models/claimCoverTmpRequest';

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
  tipoMovimiento = [];
  datosAdicionales = []
  posicion = 0;
  //RESULT
  reservaCaso : ClaimCoverResponse = new ClaimCoverResponse();
  showTable = false;
  disabledCobertura = false;

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
    modalRef.componentInstance.reservaCaso = this.reservaCaso;
    modalRef.result.then((res) => {
      if(res != undefined){
        this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NRESERVEAMOUNT = res.NMONTO;
        if(origen == 4) this.reservaCaso.LISTA_COVERCLAIM[this.posicion].SNROLETTER = res.SNROLETTER;
        this.disabledCobertura = true;
      }else{
        const adElement = document.getElementById(`a${this.posicion}`) as HTMLInputElement; 
        adElement.checked = false;
        const ddElement = document.getElementById(`d${this.posicion}`) as HTMLInputElement; 
        ddElement.checked = false;
        this.tipoMovimiento[this.posicion] = null;
        this.datosAdicionales[this.posicion] = null;
      }
    });
  }

  // deselect(i:number){
  //   const aElement = document.getElementById(`a${i}`) as HTMLInputElement; 
  //   aElement.checked = false;
  //   const bElement = document.getElementById(`d${i}`) as HTMLInputElement; 
  //   bElement.checked = false;
  // }

  eliminarTablaTemporal(data: ClaimDataCoverVM, posicion: number){
    let obj = new ClaimCoverTmpRequestBM();
    obj.SKEY = this.reservaCaso.SKEY;
    obj.NCOVER = data.NCOVER;
    Swal.fire({
      title: 'Información',
      text: '¿Está seguro de eliminar los datos adicionales para esta cobertura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        this.reserveService.DeleteCoverTmp(obj).subscribe(
          res => {
            Swal.close();
            if(res == "OK"){
              Swal.fire('Información', 'SE ELIMINARON LOS DATOS ADICIONALES DE LA COBERTURA.', 'success');
              this.disabledCobertura = false;
              this.tipoMovimiento[posicion] = null;

              const adElement = document.getElementById(`a${posicion}`) as HTMLInputElement; 
              adElement.checked = false;
              const ddElement = document.getElementById(`d${posicion}`) as HTMLInputElement; 
              ddElement.checked = false;
              //document.getElementById(`${posicion}`).checked = false
              this.reservaCaso.LISTA_COVERCLAIM[posicion].NRESERVEAMOUNT = null;
              this.reservaCaso.LISTA_COVERCLAIM[posicion].SNROLETTER = null;
              this.datosAdicionales[posicion] = null;
              return;
            }else{
              Swal.fire('Información',res,'error');
              return;
            }
          },
          err => {
            Swal.close();
            console.log(err);
          }
        )
      }
    })
  }

  reserva(event:any, origen: number, i: number){
    if(event.target.checked){

      if(this.disabledCobertura){
        Swal.fire('Información','Ya tiene datos para una cobertura','warning');
        event.target.checked = false;
        return;
      }else{
        this.posicion = i;
        if(this.tipoMovimiento[i] == null || this.tipoMovimiento[i] == undefined){
          event.target.checked = false;
          Swal.fire('Información','Debe elegir el tipo de movimiento','warning');
          return;
        }else{
          this.reservaCaso.SMOVETYPE = this.tipoMovimiento[i];
          this.openModalCobertura(origen)
        }
      }

    }
  }


}
