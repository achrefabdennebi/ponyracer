import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthYearInputComponent } from './birth-year-input.component';

describe('BirthYearInputComponent', () => {
  let component: BirthYearInputComponent;
  let fixture: ComponentFixture<BirthYearInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthYearInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BirthYearInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
