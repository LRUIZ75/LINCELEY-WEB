import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [HttpClient,CompaniesService]
    });
    service = TestBed.inject(CompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
