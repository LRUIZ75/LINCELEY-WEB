import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPeopleComponent } from './people.component';

describe('SecurityPeopleComponent', () => {
  let component: SecurityPeopleComponent;
  let fixture: ComponentFixture<SecurityPeopleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
