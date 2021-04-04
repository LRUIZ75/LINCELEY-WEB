import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDepartmentsComponent } from './departments.component';

describe('OrgDepartmentsComponent', () => {
  let component: OrgDepartmentsComponent;
  let fixture: ComponentFixture<OrgDepartmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
