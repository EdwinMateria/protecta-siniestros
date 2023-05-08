import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaSiniestroComponent } from './reserva-siniestro.component';

describe('ReservaSiniestroComponent', () => {
  let component: ReservaSiniestroComponent;
  let fixture: ComponentFixture<ReservaSiniestroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservaSiniestroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
