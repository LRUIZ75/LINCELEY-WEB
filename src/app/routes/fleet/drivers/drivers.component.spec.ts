import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetDriversComponent } from './drivers.component';

describe('FleetDriversComponent', () => {
  let component: FleetDriversComponent;
  let fixture: ComponentFixture<FleetDriversComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
