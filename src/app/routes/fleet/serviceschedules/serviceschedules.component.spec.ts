import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetServiceschedulesComponent } from './serviceschedules.component';

describe('FleetServiceschedulesComponent', () => {
  let component: FleetServiceschedulesComponent;
  let fixture: ComponentFixture<FleetServiceschedulesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetServiceschedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetServiceschedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
