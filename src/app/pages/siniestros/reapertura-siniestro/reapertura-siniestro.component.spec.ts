import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaperturaSiniestroComponent } from './reapertura-siniestro.component';

describe('ReaperturaSiniestroComponent', () => {
  let component: ReaperturaSiniestroComponent;
  let fixture: ComponentFixture<ReaperturaSiniestroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaperturaSiniestroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaperturaSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
