import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoBeneficiarioComponent } from './modal-nuevo-beneficiario.component';

describe('ModalNuevoBeneficiarioComponent', () => {
  let component: ModalNuevoBeneficiarioComponent;
  let fixture: ComponentFixture<ModalNuevoBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNuevoBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNuevoBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
