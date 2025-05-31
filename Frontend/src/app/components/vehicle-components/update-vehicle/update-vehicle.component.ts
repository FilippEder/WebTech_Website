import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, Validators} from "@angular/forms";
import {Vehicle} from '../../../models/vehicle-models/Vehicle';
import {VehicleService} from '../../../services/vehicle/vehicle.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {VehicleSellerFormComponent} from '../vehicle-seller-form/vehicle-seller-form.component';
import {Picture} from '../../../models/vehicle-models/Picture';
import {dateRangeValidator} from '../../../services/validators/date-validator.service';

@Component({
  selector: 'app-update-vehicle',
  imports: [
    FormsModule,
    NgIf,
    VehicleSellerFormComponent
  ],
  templateUrl: './update-vehicle.component.html',
  styleUrl: './update-vehicle.component.css'
})
export class UpdateVehicleComponent implements OnInit{

  updatingVehicle!: Vehicle
  updatingImages: Picture[] = []

  constructor(
    private readonly service:VehicleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder) {
  }

  form:any

  ngOnInit(): void {
    let id = +this.route.snapshot.paramMap.get('id')!
    this.getVehicle(id);
  }

  initForm(){
    this.form = this.fb.group({
      user_id: [this.updatingVehicle.user_id],
      category:[this.updatingVehicle.vehicle_category_id,Validators.required],
      mark:[this.updatingVehicle.mark_id,Validators.required],
      model:[this.updatingVehicle.model_id,Validators.required],
      type:[this.updatingVehicle.type_id,Validators.required],
      name:[this.updatingVehicle.name,Validators.required],
      description:[this.updatingVehicle.description],
      price:[this.updatingVehicle.price,Validators.required],
      first_registration:[this.updatingVehicle.first_registration,Validators.required,dateRangeValidator()],
      mileage:[this.updatingVehicle.mileage],
      fuel_type:[this.updatingVehicle.fuel_type],
      color:[this.updatingVehicle.color],
      condition:[this.updatingVehicle.condition],
      images:[null]
    })
  }

  getVehicle(id:number){
    this.service.getVehicleById(id).subscribe({
      next: (vehicle:any) =>{
        this.updatingVehicle = vehicle;
        if(vehicle.vehicle_pictures){
          this.updatingImages = vehicle.vehicle_pictures
        }
        this.initForm()
        console.log(vehicle)
      },
      error:(error)=>{
        console.error('Error:', error)
      }
    })
  }

  updateVehicle(){
    if(this.form.valid){
      let vehicle = this.form.value
      this.updatingVehicle = new Vehicle(this.updatingVehicle.vehicle_id,vehicle.user_id,
        vehicle.category,
        vehicle.mark,
        vehicle.model,
        vehicle.type,
        vehicle.name,
        vehicle.description,
        vehicle.price,
        vehicle.first_registration,
        vehicle.mileage,
        vehicle.fuel_type,
        vehicle.color,
        vehicle.condition,
        vehicle.status)

      const formData = new FormData();
      console.log(this.updatingVehicle)
      formData.append('vehicle',JSON.stringify(this.updatingVehicle))
      vehicle.images.forEach((image: File) =>{
        formData.append('images',image);
      })


      this.service.updateVehicle(this.updatingVehicle.vehicle_id, formData).subscribe({
        next:()=>{
          console.log('Vehicle updated successfully');
          this.router.navigate(['/vehicle-seller'])
        },
        error: (error)=>{
          console.error('Error:', error)
        }
      })
    }
  }

}
