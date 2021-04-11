import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddcComponent } from './adddc.component';

describe('AdddcComponent', () => {
  let component: AdddcComponent;
  let fixture: ComponentFixture<AdddcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
