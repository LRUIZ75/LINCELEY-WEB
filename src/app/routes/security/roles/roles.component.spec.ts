import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRolesComponent } from './roles.component';

describe('SecurityRolesComponent', () => {
  let component: SecurityRolesComponent;
  let fixture: ComponentFixture<SecurityRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
