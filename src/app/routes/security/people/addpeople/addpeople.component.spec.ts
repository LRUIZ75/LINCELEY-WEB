import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpeopleComponent } from './addpeople.component';

describe('AddpeopleComponent', () => {
  let component: AddpeopleComponent;
  let fixture: ComponentFixture<AddpeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
