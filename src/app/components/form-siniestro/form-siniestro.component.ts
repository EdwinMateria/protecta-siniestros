import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html',
  styleUrls: ['./form-siniestro.component.scss']
})
export class FormSiniestroComponent implements OnInit {

  @Output() cancelBool = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  opcionVolver(){
    this.cancelBool.emit(true)
  }


}
