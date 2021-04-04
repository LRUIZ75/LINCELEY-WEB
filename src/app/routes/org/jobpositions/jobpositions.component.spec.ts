import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgJobpositionsComponent } from './jobpositions.component';

describe('OrgJobpositionsComponent', () => {
  let component: OrgJobpositionsComponent;
  let fixture: ComponentFixture<OrgJobpositionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgJobpositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgJobpositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
