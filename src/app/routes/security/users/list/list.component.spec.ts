import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersListComponent } from './list.component';

describe('SecurityUsersListComponent', () => {
  let component: SecurityUsersListComponent;
  let fixture: ComponentFixture<SecurityUsersListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
