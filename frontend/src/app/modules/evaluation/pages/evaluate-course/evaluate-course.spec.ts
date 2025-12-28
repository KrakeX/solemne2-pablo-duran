import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateCourse } from './evaluate-course';

describe('EvaluateCourse', () => {
  let component: EvaluateCourse;
  let fixture: ComponentFixture<EvaluateCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluateCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
