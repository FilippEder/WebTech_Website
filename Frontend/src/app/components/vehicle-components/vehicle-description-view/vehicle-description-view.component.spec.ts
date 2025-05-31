import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDescriptionViewComponent } from './vehicle-description-view.component';

describe('VehicleDescriptionViewComponent', () => {
  let component: VehicleDescriptionViewComponent;
  let fixture: ComponentFixture<VehicleDescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDescriptionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
