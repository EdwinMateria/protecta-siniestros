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
  tipoMovimiento = [];
  datosAdicionales = []
  posicion = 0;
  //RESULT
  reservaCaso: ClaimCoverResponse = new ClaimCoverResponse();
  showTable = false;
  disabledCobertura = false;
  disabledTodo = false;

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
    this.tipoTab = index
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
    this.showTable = false
  }

  resetBuscado() {
    this.showTable = false;
    this.siniestros = [];
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
      Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });

      this.reserveService.GetClaim(this.claimRequest).subscribe(
        res => {
          Swal.close();
          this.siniestros = res;
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

  buscadorGlobal() {
    if (this.siniestro != 0) {
      Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });
      this.disabledCobertura = false;
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
            Swal.fire('Información', 'No se puede generar reserva para este siniestro', 'warning');
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
    modalRef.result.then((res) => {
      if (res != undefined) {
        this.reservaCaso.LISTA_COVERCLAIM[this.posicion].NRESERVEAMOUNT = res.NMONTO;
        if (origen == 4) this.reservaCaso.LISTA_COVERCLAIM[this.posicion].SNROLETTER = res.SNROLETTER;
        this.disabledCobertura = true;
      } else {
        const adElement = document.getElementById(`a${this.posicion}`) as HTMLInputElement;
        adElement.checked = false;
        const ddElement = document.getElementById(`d${this.posicion}`) as HTMLInputElement;
        ddElement.checked = false;
        this.tipoMovimiento[this.posicion] = null;
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
      Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });
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
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          onOpen: () => {
            Swal.showLoading();
          }
        });
        this.reserveService.DeleteCoverTmp(obj).subscribe(
          res => {
            Swal.close();
            if (res == "OK") {
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

  reserva(event: any, origen: number, i: number) {
    if (event.target.checked) {

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
        if (this.tipoMovimiento[i] == null || this.tipoMovimiento[i] == undefined) {
          event.target.checked = false;
          Swal.fire('Información', 'Debe elegir el tipo de movimiento', 'warning');
          return;
        } else {
          this.reservaCaso.SMOVETYPE = this.tipoMovimiento[i];
          this.openModalCobertura(origen)
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
        SMOVETYPE: this.tipoMovimiento[this.posicion],
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
        confirmButtonText: 'De acuerdo',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            onOpen: () => {
              Swal.showLoading();
            }
          });
          this.reserveService.ValidRegisterCoverData(reserva).subscribe(
            res => {
              Swal.close();
              if (res.SREGISTER_RESULT != "OK") {
                Swal.fire('Información', res.SMESSAGE_RESULT, 'error');
                return;
              } else {
                Swal.fire({
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  onOpen: () => {
                    Swal.showLoading();
                  }
                });
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
                    } else {
                      Swal.fire('Información', 'Reserva creada. Informacion aun en temporal');
                      this.claimRequest = new ClaimRequest();
                      this.siniestro = 0;
                      this.showTable = false;
                      this.reservaCaso = new ClaimCoverResponse();
                      this.disabledCobertura = false;
                      this.datosAdicionales = [];
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


}
