import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoncardComponent } from './personcard.component';

describe('PersoncardComponent', () => {
  let component: PersoncardComponent;
  let fixture: ComponentFixture<PersoncardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersoncardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersoncardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
