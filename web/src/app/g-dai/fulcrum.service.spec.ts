import { TestBed } from '@angular/core/testing';

import { FulcrumService } from './fulcrum.service';

describe('FulcrumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FulcrumService = TestBed.get(FulcrumService);
    expect(service).toBeTruthy();
  });
});
