import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddjobpositionComponent } from './addjobposition.component';

describe('AddjobpositionComponent', () => {
  let component: AddjobpositionComponent;
  let fixture: ComponentFixture<AddjobpositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddjobpositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddjobpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
