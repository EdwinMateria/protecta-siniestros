import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-gastos-cobertura',
  templateUrl: './modal-gastos-cobertura.component.html',
  styleUrls: ['./modal-gastos-cobertura.component.scss']
})
export class ModalGastosCoberturaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.reference.close();
  }

}
