import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCategorySelectorComponent } from './dynamic-category-selector.component';

describe('DynamicCategorySelectorComponent', () => {
  let component: DynamicCategorySelectorComponent;
  let fixture: ComponentFixture<DynamicCategorySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCategorySelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
