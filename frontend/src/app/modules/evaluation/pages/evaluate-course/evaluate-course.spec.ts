import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateCourseComponent } from './evaluate-course.component';

describe('EvaluateCourseComponent', () => {
  let component: EvaluateCourseComponent;
  let fixture: ComponentFixture<EvaluateCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluateCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateCourseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
