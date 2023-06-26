import { TestBed } from '@angular/core/testing';

import { SiniestroGuard } from './siniestro.guard';

describe('SiniestroGuard', () => {
  let guard: SiniestroGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SiniestroGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
