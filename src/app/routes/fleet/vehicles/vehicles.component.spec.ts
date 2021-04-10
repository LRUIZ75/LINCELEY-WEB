import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetVehiclesComponent } from './vehicles.component';

describe('FleetVehiclesComponent', () => {
  let component: FleetVehiclesComponent;
  let fixture: ComponentFixture<FleetVehiclesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
