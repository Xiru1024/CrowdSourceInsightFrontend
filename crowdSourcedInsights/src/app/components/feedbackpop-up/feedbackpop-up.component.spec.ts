import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackpopUpComponent } from './feedbackpop-up.component';

describe('FeedbackpopUpComponent', () => {
  let component: FeedbackpopUpComponent;
  let fixture: ComponentFixture<FeedbackpopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackpopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackpopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
