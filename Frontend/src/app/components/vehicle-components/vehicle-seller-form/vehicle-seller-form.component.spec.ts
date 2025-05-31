import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSellerFormComponent } from './vehicle-seller-form.component';

describe('VehicleSellerFormComponent', () => {
  let component: VehicleSellerFormComponent;
  let fixture: ComponentFixture<VehicleSellerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSellerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleSellerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
