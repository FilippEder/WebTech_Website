import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBuyerComponent } from './vehicle-buyer.component';

describe('VehicleBuyerComponent', () => {
  let component: VehicleBuyerComponent;
  let fixture: ComponentFixture<VehicleBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleBuyerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
