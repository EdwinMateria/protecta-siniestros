import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-nuevo-beneficiario',
  templateUrl: './modal-nuevo-beneficiario.component.html',
  styleUrls: ['./modal-nuevo-beneficiario.component.scss']
})
export class ModalNuevoBeneficiarioComponent implements OnInit {

  @Input() public reference: any;

  constructor() { }

  ngOnInit(): void {
  }
  closeModal() {
    this.reference.close();
  }
}
