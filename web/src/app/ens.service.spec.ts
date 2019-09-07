import { TestBed } from '@angular/core/testing';

import { EnsService } from './ens.service';

describe('EnsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnsService = TestBed.get(EnsService);
    expect(service).toBeTruthy();
  });
});
