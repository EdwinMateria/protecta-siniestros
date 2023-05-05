import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoCasoSiniestroComponent } from './tratamiento-caso-siniestro.component';

describe('TratamientoCasoSiniestroComponent', () => {
  let component: TratamientoCasoSiniestroComponent;
  let fixture: ComponentFixture<TratamientoCasoSiniestroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TratamientoCasoSiniestroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TratamientoCasoSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
