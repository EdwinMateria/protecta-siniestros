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
import { ClaimValRegisterRequestBM } from 'src/app/core/models/claimValRegisterRequest';
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import { ClaimComboResponse } from 'src/app/core/models/claimComboResponse';
import { ClaimValCoverRequest } from 'src/app/core/models/claimValCoverRequest';
import { SwalCarga } from "src/app/core/swal-loading";
import { ClaimBeneficiariesShowRequest } from 'src/app/core/models/claimBeneficiariesShowRequest';

@Component({
  selector: 'app-reserva-siniestro',
  templateUrl: './reserva-siniestro.component.html',
  styleUrls: ['./reserva-siniestro.component.scss']
})
export class ReservaSiniestroComponent implements OnInit {

  
  tipoTab = 1;
  registroActive = 'active';
  consultaActive = '';
  siniestros: ClaimResponse[] = [{ CODIGO: 0, DESCRIPCION: 'SELECCIONE', ESTADO: '0' }];
  claimRequest = new ClaimRequest();
  siniestro = 0;
  tiposAtencion: ClaimComboResponse[] = [];
  tipoMovimiento = "";
  datosAdicionales = []
  posicion = 0;
  posicionActual = 0;
  //RESULT
  reservaCaso: ClaimCoverResponse = new ClaimCoverResponse();
  showTable = false;
  disabledCobertura = false;
  disabledTodo = false;
  openModal = false;
  sclient = "";
  edit = false;
  estadoSiniestro = "";

  constructor(private modalService: NgbModal, public reserveService: ReserveService, public authProtectaService: AuthProtectaService) { }

  ngOnInit(): void {
  }

  obtenerTipoAtencion() {
    this.reserveService.GetComboTipoAtencion().subscribe(
      res => {
        this.tiposAtencion = res;
      }
    )
  }

  tabControl(index: number) {
    this.tipoTab = index;
    this.posicion = 0;
    this.posicionActual = 0;
    this.reservaCaso = new ClaimCoverResponse();
    if (this.tipoTab == 1) {
      this.registroActive = 'active'
      this.consultaActive = ''
    } else {
      this.registroActive = ''
      this.consultaActive = 'active'
    }
    this.claimRequest = new ClaimRequest();
    this.siniestro = 0;
    this.showTable = false;
    this.siniestros = [];
    this.siniestros.push({ CODIGO: 0, DESCRIPCION: 'SELECCIONE', ESTADO: '0' })
    this.disabledTodo = false;
  }

  resetBuscado() {
    this.showTable = false;
    this.siniestros = [];
    this.siniestros.push({ CODIGO: 0, DESCRIPCION: 'SELECCIONE', ESTADO: '0' })
    this.reservaCaso = new ClaimCoverResponse();
    this.siniestro = 0;
  }

  buscadorSiniestro() {
    this.resetBuscado();
    if (this.claimRequest == new ClaimRequest() || this.claimRequest.NCASE == null) {
      Swal.fire('Información', 'Debe ingresar un nro. caso válido.', 'warning');
      this.siniestros.push({ CODIGO: 0, DESCRIPCION: 'SELECCIONE', ESTADO: '0' })
      return;
    } else {
      SwalCarga();
      this.reserveService.GetClaim(this.claimRequest).subscribe(
        res => {
          Swal.close();
          this.siniestros = res;
          this.posicion = 0;
          this.posicionActual = 0;
          this.disabledTodo = false;
          if (res.length == 1) {
            Swal.fire('Información', 'No se encontraron siniestros para el caso ingresado', 'warning');
            return;
          } else {
            // Si tiene solo un siniestro
            if (res.length == 2) {
              this.siniestro = this.siniestros.find(x => x.CODIGO != 0).CODIGO;
              this.buscadorGlobal()
            }
          }
        },
        err => {
          Swal.close();
          Swal.fire('Error', err, 'error')
        }
      )
    }
  }

  openSelect(event: any){
    
  }

  buscadorGlobal() {
    if (this.siniestro != 0) {
      SwalCarga();
      this.datosAdicionales = [];
      let data = new ClaimCaseDataRequest();
      data.NCLAIM = this.siniestro;
      data.NCASE = this.claimRequest.NCASE;
      this.reserveService.GetClaimCaseData(data).subscribe(
        res => {
          Swal.close()
          this.showTable = true;
          this.obtenerTipoAtencion();
          this.reservaCaso = res;
          let siniestroEstado = this.siniestros.find(x => x.CODIGO == this.siniestro).ESTADO;
          if (siniestroEstado == '1' || siniestroEstado == '5' || siniestroEstado == '7') {
            if(siniestroEstado == '1'){
              Swal.fire('Información', 'No se puede generar reserva para este siniestro. El estado del siniestro: Anulado.', 'warning');
              this.estadoSiniestro = "Anulado"
            };
            if(siniestroEstado == '5'){
              Swal.fire('Información', 'No se puede generar reserva para este siniestro. El estado del siniestro: Pagado Total.', 'warning');
              this.estadoSiniestro = "Pago total"
            };
            if(siniestroEstado == '7'){
              Swal.fire('Información', 'No se puede generar reserva para este siniestro. El estado del siniestro: Rechazado.', 'warning');
              this.estadoSiniestro = "Rechazado"
            };
            this.disabledTodo = true;
            return;
          } else {
            this.disabledTodo = false;
          }
        },
        err => {
          Swal.close()
          Swal.fire('Error', err, 'error')
        }
      )

    }
  }

  modalCobverturaAction(origen: number) {
    const modalRef = this.modalService.open(ModalCoberturaComponent, { windowClass: "my-class", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = origen;
    modalRef.componentInstance.reservaCaso = this.reservaCaso;
    modalRef.componentInstance.tab = this.tipoTab;
    modalRef.componentInstance.disabledBotones = this.disabledTodo;
    modalRef.componentInstance.tipoMovimiento = this.tipoMovimiento;
    modalRef.componentInstance.sclient = this.sclient;
    modalRef.componentInstance.edit = this.edit;
    modalRef.result.then((res) => {
      if (res != undefined) {

        this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NRESERVEAMOUNT = res.NMONTO;
        this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NACCUMRESERVE = 0;
        this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NACCUMRESERVE = this.tipoMovimiento == "D" ? this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NACCUMRESERVE2 - res.NMONTO : this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NACCUMRESERVE2 + res.NMONTO;
        if (origen == 4) this.reservaCaso.LISTA_COVERCLAIM[this.posicion].SNROLETTER = res.SNROLETTER;
        this.disabledCobertura = true;
      } else {
         this.datosAdicionales[this.posicion] = null;
      }
    });
  }

  openModalCobertura(origen: number) {
    if (this.tipoTab == 2) {
      let request = new ClaimValCoverRequest();
      request.NCASE_NUM = Number(this.reservaCaso.NCASE_NUM);
      request.NCLAIM = Number(this.reservaCaso.NCLAIM);
      request.NCOVER = origen;
      SwalCarga();
      this.reserveService.ValidCoverReserve(request).subscribe(
        res => {
          Swal.close();
          if (res.SRESULT == 'OK') {
            this.modalCobverturaAction(origen)
          } else {
            Swal.fire('Información', res.SRESULT, 'warning');
            return;
          }
        },
        err => {
          Swal.close();
          Swal.fire('Error', err, 'error');
        }
      )

    } else {
      this.modalCobverturaAction(origen)
    }
  }

  eliminarTablaTemporal(data: ClaimDataCoverVM, posicion: number) {
    let obj = new ClaimCoverTmpRequestBM();
    obj.SKEY = this.reservaCaso.SKEY;
    obj.NCOVER = data.NCOVER;
    Swal.fire({
      title: 'Información',
      text: '¿Está seguro de eliminar los datos adicionales para esta cobertura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        SwalCarga();
        this.reserveService.DeleteCoverTmp(obj).subscribe(
          res => {
            Swal.close();
            if (res == "OK") {
              Swal.fire('Información', 'Se eliminaron los datos adicionales de la cobertura.', 'success');
              this.disabledCobertura = false;
              //this.tipoMovimiento[posicion] = null;
              this.tipoMovimiento = ""
              const adElement = document.getElementById(`a${posicion}`) as HTMLInputElement;
              adElement.checked = false;
              const ddElement = document.getElementById(`d${posicion}`) as HTMLInputElement;
              ddElement.checked = false;
              //document.getElementById(`${posicion}`).checked = false
              this.reservaCaso.LISTA_COVERCLAIM[posicion].NRESERVEAMOUNT = null;
              this.reservaCaso.LISTA_COVERCLAIM[posicion].SNROLETTER = null;
              
              this.reservaCaso.LISTA_COVERCLAIM[posicion].NACCUMRESERVE = 0;
              this.reservaCaso.LISTA_COVERCLAIM[posicion].NACCUMRESERVE = this.reservaCaso.LISTA_COVERCLAIM[posicion].NACCUMRESERVE2;
              this.datosAdicionales[posicion] = null;
              return;
            } else {
              Swal.fire('Información', res, 'error');
              return;
            }
          },
          err => {
            Swal.close();
            Swal.fire('Error', err, 'error')
          }
        )
      }
    })
  }

  reserva(event: any, claim: ClaimDataCoverVM, i: number) {
    if (event.target.checked) {

      this.edit = false;
      if(claim.NACCUMRESERVE == claim.NSUMINSURED){
        Swal.fire('Información', 'Cobertura no tiene saldo.','warning');
        const adElement = document.getElementById(`a${i}`) as HTMLInputElement;
        adElement.checked = false;
        const ddElement = document.getElementById(`d${i}`) as HTMLInputElement;
        ddElement.checked = false;
        event.target.checked = false;
        return;
      }

      if (this.disabledCobertura) {
        Swal.fire('Información', 'Ya tiene datos para una cobertura', 'warning');
        const adElement = document.getElementById(`a${i}`) as HTMLInputElement;
        adElement.checked = false;
        const ddElement = document.getElementById(`d${i}`) as HTMLInputElement;
        ddElement.checked = false;
        event.target.checked = false;
        return;
      } else {
        this.posicion = i;
        if (this.tipoMovimiento == null || this.tipoMovimiento == undefined || this.tipoMovimiento == "") {
          event.target.checked = false;
          Swal.fire('Información', 'Debe elegir el tipo de movimiento', 'warning');
          return;
        } else {
          if(this.posicionActual != this.posicion){
            event.target.checked = false;
            Swal.fire('Información', 'Debe elegir el tipo de movimiento', 'warning');
            return;
          }else{
            this.reservaCaso.SMOVETYPE = this.tipoMovimiento;
            this.sclient = claim.SCLIENT;
            this.openModalCobertura(claim.NCOVER)
          }
        }
      }

    }
  }


  guardarTablasDefinitivas() {
    let reserva = new ClaimValRegisterRequestBM();

    let cookie = this.authProtectaService.getCookie('AppSiniestro');
    let codUsuario = this.authProtectaService.getValueCookie('CodUsu', cookie);
    let cover = this.reservaCaso.LISTA_COVERCLAIM[this.posicion];

    if (this.disabledCobertura) {
      reserva.LIST_PARAM_RESERVE.push({
        SKEY: this.reservaCaso.SKEY,
        SMOVETYPE: this.tipoMovimiento,
        NCLAIM: Number(this.reservaCaso.NCLAIM),
        NCOVER: cover.NCOVER,
        NRESERVEAMOUNT: cover.NRESERVEAMOUNT,
        NSUMASSURED: cover.NSUMINSURED,
        NPOLICY: this.reservaCaso.NPOLICY,
        NCERTIF: this.reservaCaso.NCERTIF,
        NMODULEC: cover.NMODULEC,
        NCURRENCY: cover.NCURRENCY,
        NUSERCODE: Number(atob(codUsuario)),
        DOCCURDAT: this.reservaCaso.DOCCURDAT,
        SCLIENT: cover.SCLIENT,
        NCASE_NUM: Number(this.reservaCaso.NCASE_NUM)
      })


      Swal.fire({
        title: 'Información',
        text: `¿Está seguro de registrar una reserva para la cobertura ${cover.SDESCOVER}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          SwalCarga();
          this.reserveService.ValidRegisterCoverData(reserva).subscribe(
            res => {
              Swal.close();
              if (res.SREGISTER_RESULT != "OK") {
                Swal.fire('Información', res.SMESSAGE_RESULT, 'error');
                return;
              } else {
                SwalCarga();
                //evento eliminar temporal
                let request = new ClaimCoverTmpRequestBM();
                request.SKEY = this.reservaCaso.SKEY;
                request.NCOVER = cover.NCOVER;
                this.reserveService.DeleteCoverTmp(request).subscribe(
                  res => {
                    Swal.close();
                    if (res == 'OK') {
                      Swal.fire('Información', 'Reserva creada correctamente.', 'success');
                      this.claimRequest = new ClaimRequest();
                      this.siniestro = 0;
                      this.showTable = false;
                      this.reservaCaso = new ClaimCoverResponse();
                      this.disabledCobertura = false;
                      this.datosAdicionales = [];
                      this.posicion = 0;
                      this.posicionActual = 0;
                    } else {
                      Swal.fire('Información', 'Reserva creada. Informacion aun en temporal');
                      this.claimRequest = new ClaimRequest();
                      this.siniestro = 0;
                      this.showTable = false;
                      this.reservaCaso = new ClaimCoverResponse();
                      this.disabledCobertura = false;
                      this.datosAdicionales = [];
                      this.posicion = 0;
                      this.posicionActual = 0;
                    }
                  },
                  err => {
                    Swal.close();
                    Swal.fire('Error', err, 'error');
                  }
                )
              }
            },
            error => {
              Swal.close();
              Swal.fire('Error', error, 'error')
            }
          )
        }
      })

    } else {
      Swal.fire('Información', 'Debe seleccionar una cobertura', 'warning');
      return;
    }

  }

  changeRadio(i:number, event: any){
    this.posicionActual = i;
  }

  showModal(openSidebar:boolean){
    this.openModal = openSidebar
  }

  editarTemporal(data: ClaimDataCoverVM){
    this.edit = true;
    this.modalCobverturaAction(data.NCOVER);
  }

}
