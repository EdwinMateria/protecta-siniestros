import { TestBed } from '@angular/core/testing';

import { SiniestroIntercepInterceptor } from './siniestro-intercep.interceptor';

describe('SiniestroIntercepInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SiniestroIntercepInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SiniestroIntercepInterceptor = TestBed.inject(SiniestroIntercepInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
