import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDcsComponent } from './dcs.component';

describe('OrgDcsComponent', () => {
  let component: OrgDcsComponent;
  let fixture: ComponentFixture<OrgDcsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
