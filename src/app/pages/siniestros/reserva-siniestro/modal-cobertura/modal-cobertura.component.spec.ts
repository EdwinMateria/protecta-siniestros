import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCoberturaComponent } from './modal-cobertura.component';

describe('ModalCoberturaComponent', () => {
  let component: ModalCoberturaComponent;
  let fixture: ComponentFixture<ModalCoberturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCoberturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCoberturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
