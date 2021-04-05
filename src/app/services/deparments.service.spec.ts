import { TestBed } from '@angular/core/testing';

import { DeparmentsService } from './deparments.service';

describe('DeparmentsService', () => {
  let service: DeparmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeparmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
