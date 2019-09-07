import { TestBed } from '@angular/core/testing';

import { GDAIService } from './g-dai.service';

describe('GDAIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GDAIService = TestBed.get(GDAIService);
    expect(service).toBeTruthy();
  });
});
