import { TestBed } from '@angular/core/testing';

import { ServiceshedulesService } from './serviceshedules.service';

describe('ServiceshedulesService', () => {
  let service: ServiceshedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceshedulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
