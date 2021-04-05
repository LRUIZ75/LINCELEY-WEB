import { TestBed } from '@angular/core/testing';

import { DistributionCentersService } from './distributioncenters.service';

describe('DistributionCentersService', () => {
  let service: DistributionCentersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributionCentersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
