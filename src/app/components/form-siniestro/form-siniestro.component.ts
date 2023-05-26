import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html',
  styleUrls: ['./form-siniestro.component.scss']
})
export class FormSiniestroComponent implements OnInit {

  @Output() cancelBool = new EventEmitter<boolean>();
  @Input() estadoForm : number;
  eliminado = false;
  form!: FormGroup;
  eliminarSiniestro = '';

  constructor(public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      poliza: [{value:'', disabled: true}],
      certificado : [{value:'', disabled: true}],
      nroCaso: [{value:'', disabled: true}],
      nroSiniestro: [{value:'', disabled: true}],
      fechaOcurrencia: [{value:'', disabled: true}],
      horaOcurrencia: [{value:'', disabled: true}],
      causaSiniestro: [{value:'', disabled: true}],
      moneda: [{value:'', disabled: true}],
      fechaDenuncia : [{value:'', disabled: false}, Validators.required],
      horaRecepcion: [{value:'', disabled: false}, Validators.required],
      fechaApertura: [{value:'', disabled: false}, Validators.required],
      afectado: [{value:'', disabled: false}, Validators.required],
      tipoOcupante : [{value:'', disabled: false}, Validators.required],
      tipoAtencion: [{value:'', disabled: false}, Validators.required],
      diagnostico: [{value:'', disabled: false}, Validators.required],
      fechaFallecido: [{value:'', disabled: false}],
      siniestroEquivalente: [{value:'', disabled: false}],
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
    }
  }

  disabledForm(){
    if(this.estadoForm == 3){
      this.form.controls['fechaDenuncia'].disable();
      this.form.controls['horaRecepcion'].disable();
      this.form.controls['fechaApertura'].disable();
      this.form.controls['afectado'].disable();
      this.form.controls['tipoOcupante'].disable();
      this.form.controls['tipoAtencion'].disable();
      this.form.controls['diagnostico'].disable();
      this.form.controls['fechaFallecido'].disable();
      this.form.controls['siniestroEquivalente'].disable();
    }

    if(this.estadoForm == 1){
      this.form.controls['fechaDenuncia'].disable();
      this.form.controls['horaRecepcion'].disable();
      this.form.controls['diagnostico'].disable();
    }
  }


}
