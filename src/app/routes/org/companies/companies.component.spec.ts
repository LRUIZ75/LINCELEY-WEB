import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgCompaniesComponent } from './companies.component';

describe('OrgCompaniesComponent', () => {
  let component: OrgCompaniesComponent;
  let fixture: ComponentFixture<OrgCompaniesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
