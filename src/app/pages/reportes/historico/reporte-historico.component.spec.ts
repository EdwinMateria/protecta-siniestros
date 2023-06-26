import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHistoricoComponent } from './reporte-historico.component';

describe('ReporteHistoricoComponent', () => {
  let component: ReporteHistoricoComponent;
  let fixture: ComponentFixture<ReporteHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});