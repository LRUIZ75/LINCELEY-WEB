import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetAssignmentsComponent } from './assignments.component';

describe('FleetAssignmentsComponent', () => {
  let component: FleetAssignmentsComponent;
  let fixture: ComponentFixture<FleetAssignmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
