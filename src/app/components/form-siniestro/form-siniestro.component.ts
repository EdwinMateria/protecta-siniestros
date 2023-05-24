import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html',
  styleUrls: ['./form-siniestro.component.scss']
})
export class FormSiniestroComponent implements OnInit {

  @Output() cancelBool = new EventEmitter<boolean>();
  @Input() estadoForm : boolean;
  eliminado = false;
  form!: FormGroup;

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
      fechaDenuncia : [{value:'', disabled: true}, Validators.required],
      horaRecepcion: [{value:'', disabled: true}, Validators.required],
      fechaApertura: [{value:'', disabled: true}, Validators.required],
      afectado: [{value:'', disabled: true}, Validators.required],
      tipoOcupante : [{value:'', disabled: true}, Validators.required],
      tipoAtencion: [{value:'', disabled: true}, Validators.required],
      diagnostico: [{value:'', disabled: true}, Validators.required],
      fechaFallecido: [{value:'', disabled: true}],
      siniestroEquivalente: [{value:'', disabled: true}],
    })
  }

  opcionVolver(){
    this.cancelBool.emit(true)
  }

  eventoSiniestro(){
    this.eliminado = true
  }


}
