import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSiniestroComponent } from './form-siniestro.component';

describe('FormSiniestroComponent', () => {
  let component: FormSiniestroComponent;
  let fixture: ComponentFixture<FormSiniestroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSiniestroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
