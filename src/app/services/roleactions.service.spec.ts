import { TestBed } from '@angular/core/testing';

import { RoleActionsService } from './roleactions.service';

describe('RoleActionsService', () => {
  let service: RoleActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
