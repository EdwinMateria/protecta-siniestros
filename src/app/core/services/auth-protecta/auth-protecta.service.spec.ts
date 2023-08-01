import { TestBed } from '@angular/core/testing';

import { AuthProtectaService } from './auth-protecta.service';

describe('AuthProtectaService', () => {
  let service: AuthProtectaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthProtectaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
