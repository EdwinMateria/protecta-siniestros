import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGastosCoberturaComponent } from './modal-gastos-cobertura.component';

describe('ModalGastosCoberturaComponent', () => {
  let component: ModalGastosCoberturaComponent;
  let fixture: ComponentFixture<ModalGastosCoberturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGastosCoberturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGastosCoberturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
