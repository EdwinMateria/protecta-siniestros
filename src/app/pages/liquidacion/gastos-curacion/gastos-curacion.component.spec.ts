import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCuracionComponent } from './gastos-curacion.component';

describe('GastosCuracionComponent', () => {
  let component: GastosCuracionComponent;
  let fixture: ComponentFixture<GastosCuracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosCuracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCuracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
