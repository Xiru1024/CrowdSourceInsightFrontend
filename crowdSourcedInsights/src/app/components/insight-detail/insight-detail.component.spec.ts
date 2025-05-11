import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightDetailComponent } from './insight-detail.component';

describe('InsightDetailComponent', () => {
  let component: InsightDetailComponent;
  let fixture: ComponentFixture<InsightDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
