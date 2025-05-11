import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCreationPopComponent } from './insight-creation-pop.component';

describe('InsightCreationPopComponent', () => {
  let component: InsightCreationPopComponent;
  let fixture: ComponentFixture<InsightCreationPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightCreationPopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightCreationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
