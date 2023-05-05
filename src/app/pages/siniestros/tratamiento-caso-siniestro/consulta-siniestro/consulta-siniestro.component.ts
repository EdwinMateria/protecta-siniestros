import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consulta-siniestro',
  templateUrl: './consulta-siniestro.component.html',
  styleUrls: ['./consulta-siniestro.component.scss']
})
export class ConsultaSiniestroComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.reference.close();
  }

}
