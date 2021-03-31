import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersComponent } from './users.component';

describe('SecurityUsersComponent', () => {
  let component: SecurityUsersComponent;
  let fixture: ComponentFixture<SecurityUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
