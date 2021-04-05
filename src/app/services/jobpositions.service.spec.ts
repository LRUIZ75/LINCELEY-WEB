import { TestBed } from '@angular/core/testing';

import { JobPositionsService } from './jobpositions.service';

describe('JobPositionsService', () => {
  let service: JobPositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
