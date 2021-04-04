import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgEmployeesComponent } from './employees.component';

describe('OrgEmployeesComponent', () => {
  let component: OrgEmployeesComponent;
  let fixture: ComponentFixture<OrgEmployeesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
