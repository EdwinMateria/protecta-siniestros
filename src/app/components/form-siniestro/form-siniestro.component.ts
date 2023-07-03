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
  //Tipos Ocupantes:
  ocupantes : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo : "1", descript : "Ocupante"},
    {codigo : "2", descript : "Tercero"}
  ]
  
  // Tipos Atencion:
  atenciones : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo: "A", descript: "Ambulatorio"},
    {codigo: "H", descript: "Hospitalario"},
    {codigo: "E", descript: "Emergencia"}
  ]

  constructor(public fb: FormBuilder, private modalService: NgbModal, public casoService: CasosService, private datePipe: DatePipe) {
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

    if(this.estadoForm == 2){
      //Creacion siniestro
    }
    if(this.estadoForm != 2 ){
      //Edicion y rechazo siniestro 
      SwalCarga();
      this.casoService.GetSearchClaim(this.casoBM.nSiniestro).subscribe(
        res => {
          Swal.close()
          let siniestro = new SiniestroBM();
          siniestro = res.GenericResponse[0];
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
            this.fechaRechazo = this.datePipe.transform(siniestro.dFecRechazo, 'yyyy-MM-dd');
            this.eliminarSiniestro = siniestro.nCodRechazo.toString();
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
      const data: FormData = new FormData();
      data.append('siniestrosData', JSON.stringify(siniestro));
      this.casoService.AddRechazo(data).subscribe(
        res => {
          Swal.close()
          if(res.Message.length > 0){
            Swal.fire('Información',res.Message,'error');
            return;
          }else{
            Swal.fire('Información', 'Siniestro rechazado correctamente', 'success');
            this.eliminado = true
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
      siniestroBM = {
        ...this.form.getRawValue(),
        nCaso : this.casoBM.nCaso,
        sCliente : this.sCliente
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
              confirmButtonText: 'De acuerdo',
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
        siniestroBM = {
          ...this.form.getRawValue(),
          nPolicy : this.casoBM.nPolicy,
          nCertif : this.casoBM.nCertif,
          nCaso : this.casoBM.nCaso,
          nSiniestro : this.nSiniestro,
          sCliente : this.sCliente,
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
    modalRef.result.then((benef) => {
      if(benef != undefined){
        this.form.controls['afectado'].setValue(benef.SNAME);
        this.sCliente = benef.SCODE;
      }
    })
  }


}
