import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasosBM } from 'src/app/core/models/caso';
import { SiniestroBM } from 'src/app/core/models/siniestroBM';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { ModalBeneficiarioComponent } from 'src/app/pages/siniestros/reserva-siniestro/modal-beneficiario/modal-beneficiario.component';
import Swal from 'sweetalert2';

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
  eliminarSiniestro = '';
  fechaMap = "";

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

  constructor(public fb: FormBuilder, private modalService: NgbModal, public casoService: CasosService) {
  }

  ngOnInit(): void {
    this.fechaMap = new Date(this.casoBM.dFecOcurrencia).toLocaleDateString('en-GB')
    this.form = this.fb.group({
      dFecDenuncia : [{value:'', disabled: false}, Validators.required],
      horaRecepcion: [{value:'', disabled: false}, Validators.required],
      dFecApertura: [{value:'', disabled: false}, Validators.required],
      afectado: [{value:'CLIENTE PRUEBA', disabled: false}, Validators.required],
      nTipOcupante : [{value:'', disabled: false}, Validators.required],
      sTipAtencion: [{value:'', disabled: false}, Validators.required],
      dFecFallecido: [{value:'', disabled: false}],
      sEquivSiniestro: [{value:'', disabled: false}],
    })
    this.disabledForm();
    //this.estadoForm = false ? true : false
  }

  opcionVolver(){
    this.cancelBool.emit(true)
  }

  rechazoSiniestro(){
    if(this.eliminarSiniestro != ''){
      this.eliminado = true
    }else{
      Swal.fire('Información','Debe seleccionar un motivo de rechazo', 'warning');
    }
  }

  saveSiniestro(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      let siniestroBM = new SiniestroBM();
      siniestroBM = {
        ...this.form.getRawValue(),
        nCaso : this.casoBM.nCaso,
      }
      const data: FormData = new FormData();
      data.append('siniestrosData', JSON.stringify(siniestroBM));
      Swal.showLoading();
      this.casoService.AddSiniestros(data).subscribe(
        res => {
          Swal.close();
          if(res.Message != "OK"){
            Swal.fire('Información',res.Message, 'error');
            return;
          }else{
            Swal.fire({
              title: 'Información',
              text: `Se declaró el siniestro correctamente. ¿Desea declarar otro siniestro?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'De acuerdo',
              cancelButtonText: 'No',
              reverseButtons: true
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
          console.log(err)
        }
      )
    }
  }

  disabledForm(){
    if(this.estadoForm == 3){
      this.form.controls['dFecDenuncia'].disable();
      this.form.controls['horaRecepcion'].disable();
      this.form.controls['dFecApertura'].disable();
      this.form.controls['afectado'].disable();
      this.form.controls['nTipOcupante'].disable();
      this.form.controls['sTipAtencion'].disable();
      this.form.controls['dFecFallecido'].disable();
      this.form.controls['sEquivSiniestro'].disable();
    }

    if(this.estadoForm == 1){
      this.form.controls['dFecDenuncia'].disable();
      this.form.controls['horaRecepcion'].disable();
    }
  }

  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((benef) => {
      console.log(benef);
    })
  }


}
