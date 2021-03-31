import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersFormComponent } from './form.component';

describe('SecurityUsersFormComponent', () => {
  let component: SecurityUsersFormComponent;
  let fixture: ComponentFixture<SecurityUsersFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityUsersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
