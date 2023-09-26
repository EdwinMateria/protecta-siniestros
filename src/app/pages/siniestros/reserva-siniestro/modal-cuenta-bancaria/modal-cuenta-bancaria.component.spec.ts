import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuentaBancariaComponent } from './modal-cuenta-bancaria.component';

describe('ModalCuentaBancariaComponent', () => {
  let component: ModalCuentaBancariaComponent;
  let fixture: ComponentFixture<ModalCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
