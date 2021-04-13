import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddservscheduleComponent } from './addservschedule.component';

describe('AddservscheduleComponent', () => {
  let component: AddservscheduleComponent;
  let fixture: ComponentFixture<AddservscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddservscheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddservscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
