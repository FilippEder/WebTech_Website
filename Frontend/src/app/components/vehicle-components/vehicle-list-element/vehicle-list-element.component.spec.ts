import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListElementComponent } from './vehicle-list-element.component';

describe('VehicleListElementComponent', () => {
  let component: VehicleListElementComponent;
  let fixture: ComponentFixture<VehicleListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleListElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
