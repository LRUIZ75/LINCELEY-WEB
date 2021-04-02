import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersAdduserComponent } from './adduser.component';

describe('SecurityUsersAdduserComponent', () => {
  let component: SecurityUsersAdduserComponent;
  let fixture: ComponentFixture<SecurityUsersAdduserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityUsersAdduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityUsersAdduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
