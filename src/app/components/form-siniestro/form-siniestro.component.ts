import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html',
  styleUrls: ['./form-siniestro.component.scss']
})
export class FormSiniestroComponent implements OnInit {

  @Output() cancelBool = new EventEmitter<boolean>();
  @Input() estadoForm : number;
  eliminado = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  opcionVolver(){
    this.cancelBool.emit(true)
  }

  eventoSiniestro(){
    this.eliminado = true
  }


}
