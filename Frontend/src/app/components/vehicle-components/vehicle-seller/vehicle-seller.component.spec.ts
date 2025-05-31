import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSellerComponent } from './vehicle-seller.component';

describe('VehicleSellerComponent', () => {
  let component: VehicleSellerComponent;
  let fixture: ComponentFixture<VehicleSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
