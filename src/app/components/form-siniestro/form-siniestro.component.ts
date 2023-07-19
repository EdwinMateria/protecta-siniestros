import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasosBM } from 'src/app/core/models/caso';
import { SiniestroBM } from 'src/app/core/models/siniestroBM';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { ModalBeneficiarioComponent } from 'src/app/pages/siniestros/reserva-siniestro/modal-beneficiario/modal-beneficiario.component';
import Swal from 'sweetalert2';
import { SwalCarga } from "src/app/core/swal-loading";
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import { ClaimBeneficiarioRequest } from 'src/app/core/models/claimBeneficiarioRequest';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';


export class SiniestroSelect{
  codigo    : string;
  descript  : string;
}

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html',
  styleUrls: ['./form-siniestro.component.scss']
})
export class FormSiniestroComponent implements OnInit {

  @Output() cancelBool = new EventEmitter<boolean>();
  @Input() estadoForm : number;
  @Input() casoBM : CasosBM = new CasosBM();
  eliminado = false;
  form!: FormGroup;
  eliminarSiniestro = '0';
  fechaMap = "";
  nSiniestro = "";
  sCliente = "";
  fechaRechazo : any;
  moneda: number;
  //Tipos Ocupantes:
  ocupantes : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo : "1", descript : "Si"},
    {codigo : "2", descript : "No"}
  ]
  
  // Tipos Atencion:
  atenciones : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo: "A", descript: "Ambulatorio"},
    {codigo: "H", descript: "Hospitalario"},
    {codigo: "E", descript: "Emergencia"}
  ]

  constructor(public fb: FormBuilder, private modalService: NgbModal, public casoService: CasosService, private datePipe: DatePipe, 
    public authProtectaService: AuthProtectaService, public reserveService: ReserveService) {
  }

  ngOnInit(): void {
    this.fechaMap = new Date(this.casoBM.dFecOcurrencia).toLocaleDateString('en-GB')
    this.form = this.fb.group({
      dFecDenuncia : [{value:'', disabled: false}, Validators.required],
      sHoraRecepcion: [{value:'', disabled: false}, Validators.required],
      dFecApertura: [{value:'', disabled: false}, Validators.required],
      afectado: [{value:'', disabled: false}, Validators.required],
      nTipOcupante : [{value:'', disabled: false}, Validators.required],
      sTipAtencion: [{value:'', disabled: false}, Validators.required],
      dFecFallecido: [{value:'', disabled: false}],
      sEquivSiniestro: [{value:'', disabled: false}],
    })
    this.disabledForm();
    this.moneda = this.casoBM.nMoneda;
    if(this.estadoForm == 2){
      //Creacion siniestro
    }
    if(this.estadoForm != 2 ){
      //Edicion y rechazo siniestro 
      SwalCarga();
      this.casoService.GetSearchClaim(this.casoBM.nSiniestro).subscribe(
        res => {
          Swal.close()
          if(res.GenericResponse.length == 0){
            Swal.fire({
              title: 'Información',
              text: 'El siniestro tiene pago total',
              icon: 'warning',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.cancelBool.emit(true)
              }
            })
          }else{
            let siniestro = new SiniestroBM();
            siniestro = res.GenericResponse[0];
            this.moneda = siniestro.nMoneda;
            this.nSiniestro = siniestro.nSiniestro.toString();
            this.form.patchValue({
              ...siniestro
            })
            this.form.controls['dFecDenuncia'].setValue(new Date(siniestro.dFecDenuncia).toLocaleDateString('en-GB'))
            this.form.controls['afectado'].setValue(siniestro.sCliente);
            this.form.controls['dFecApertura'].setValue(this.datePipe.transform(siniestro.dFecApertura, 'yyyy-MM-dd'))
            this.form.controls['dFecFallecido'].setValue(this.datePipe.transform(siniestro.dFecFallecido, 'yyyy-MM-dd'))
            this.sCliente = siniestro.sCodClie;
            this.form.controls['nTipOcupante'].setValue(siniestro.sTipOcupante);
  
            if(siniestro.nCodRechazo != 0 && this.estadoForm == 3){
              this.eliminado = true;
              let fRechazo = this.datePipe.transform(siniestro.dFecRechazo, 'yyyy-MM-dd').split('-');
              let anio = fRechazo[0];
              let mes = fRechazo[1];
              let dia = fRechazo[2];
              this.fechaRechazo = `${dia}/${mes}/${anio}`;
              this.eliminarSiniestro = siniestro.nCodRechazo.toString();
            }
          }
        },
        err => {
          Swal.close();
          Swal.fire('Error',err,'error')
        }
      )
    }
  }

  opcionVolver(){
    this.cancelBool.emit(true)
  }

  rechazoSiniestro(){
    if(this.eliminarSiniestro != '0'){
      SwalCarga();
      let siniestro = new SiniestroBM();
      siniestro.nCaso = this.casoBM.nCaso;
      siniestro.sCliente = this.sCliente;
      siniestro.nCodRechazo = Number(this.eliminarSiniestro);
      siniestro.nSiniestro = Number(this.nSiniestro);
      siniestro.dFecApertura = this.form.controls['dFecApertura'].value;

      let cookie = this.authProtectaService.getCookie('AppSiniestro');
      let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);
      siniestro.nCodUsuario = Number(atob(codUsuario));
      const data: FormData = new FormData();
      data.append('siniestrosData', JSON.stringify(siniestro));
      this.casoService.AddRechazo(data).subscribe(
        res => {
          Swal.close()
          if(res.Message != 'Ok'){
            Swal.fire('Información',res.Message,'error');
            return;
          }else{
            Swal.fire('Información', 'Siniestro rechazado correctamente', 'success');
            this.eliminado = true;
            let dia = ("0" + (new Date().getDate())).slice(-2);
            let mes = ("0" + (new Date().getMonth() + 1)).slice(-2);
            let anio = new Date().getFullYear();
            this.fechaRechazo = `${dia}/${mes}/${anio}`;
            return;
          }
        },
        err => {
          Swal.close()
          Swal.fire('Error',err,'error')
        }
      )
    }else{
      Swal.fire('Información','Debe seleccionar un motivo de rechazo', 'warning');
    }
  }

  saveSiniestro(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      if(this.estadoForm == 2){
        //Creacion siniestro
        let siniestroBM = new SiniestroBM();
        let cookie = this.authProtectaService.getCookie('AppSiniestro');
      let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);
      siniestroBM = {
        ...this.form.getRawValue(),
        nCaso : this.casoBM.nCaso,
        sCliente : this.sCliente,
        nCodUsuario : Number(atob(codUsuario))
      }
      const data: FormData = new FormData();
      data.append('siniestrosData', JSON.stringify(siniestroBM));
      SwalCarga();
      this.casoService.AddSiniestros(data).subscribe(
        res => {
          Swal.close();
          if(res.Message != "OK"){
            Swal.fire('Información',res.Message, 'error');
            return;
          }else{
            Swal.fire({
              title: 'Información',
              text: `Se declaró el siniestro ${res.numclaim} correctamente. ¿Desea declarar otro siniestro?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              cancelButtonText: 'No',
              reverseButtons: true,
              showCloseButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                this.form.reset()
              }else{
                this.cancelBool.emit(true)
              }
            })
          }
        },
        err => {
          Swal.close();
          Swal.fire('Error',err,'error')
        }
      )
      }
      if(this.estadoForm == 1){
        //Editar siniestro
        let siniestroBM = new SiniestroBM();
        let cookie = this.authProtectaService.getCookie('AppSiniestro');
        let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);
        siniestroBM = {
          ...this.form.getRawValue(),
          nPolicy : this.casoBM.nPolicy,
          nCertif : this.casoBM.nCertif,
          nCaso : this.casoBM.nCaso,
          nSiniestro : this.nSiniestro,
          sCliente : this.sCliente,
          nCodUsuario : Number(atob(codUsuario))
        }
        SwalCarga();
        this.casoService.UpdateClaim(siniestroBM).subscribe(
          res => {
            Swal.close();
            if(res.Message !="Ok"){
              Swal.fire('Información', res.Message,'warning');
              return;
            }else{
              Swal.fire({
                title: 'Información',
                text: 'Siniestro actualizado correctamente',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.cancelBool.emit(true)
                }
              })
              return;
            }
          },
          err => {
            Swal.close();
            Swal.fire('Error',err,'error')
          }
        )
      }
    }
  }

  disabledForm(){
    if(this.estadoForm == 3){
      this.form.controls['dFecDenuncia'].disable();
      this.form.controls['sHoraRecepcion'].disable();
      this.form.controls['dFecApertura'].disable();
      this.form.controls['afectado'].disable();
      this.form.controls['nTipOcupante'].disable();
      this.form.controls['sTipAtencion'].disable();
      this.form.controls['dFecFallecido'].disable();
      this.form.controls['sEquivSiniestro'].disable();
    }

    if(this.estadoForm == 1){
      this.form.controls['dFecDenuncia'].disable();
      this.form.controls['sHoraRecepcion'].disable();
    }
  }

  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.origen = 1;  
    modalRef.result.then((benef) => {
      console.log(benef);
      if((benef != undefined && benef.SCODE) || (benef != undefined && benef.P_SCOD_CLIENT)){
        SwalCarga();
        let data = new ClaimBeneficiarioRequest();
        if(benef.SCODE) data.SCODCLI = benef.SCODE.trim();
        if(benef.P_SCOD_CLIENT) data.SCODCLI = benef.P_SCOD_CLIENT.trim();
        console.log(data);
        this.reserveService.GetBeneficiariesAdditionalDataCover(data).subscribe(
          res =>{
            Swal.close();
            this.form.controls['afectado'].setValue(res.ListBeneficiaries[0].SNAME);
            this.sCliente = res.ListBeneficiaries[0].SCODE.trim();
          },
          err => {
            Swal.close();
            Swal.fire('Información',err,'error');
          }
        )
        
      }
    })
  }


}
