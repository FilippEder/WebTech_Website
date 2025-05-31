import {asNativeElements, Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, Validators} from '@angular/forms';
import {Vehicle} from '../../../models/vehicle-models/Vehicle';
import {VehicleService} from '../../../services/vehicle/vehicle.service';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {VehicleSellerFormComponent} from '../vehicle-seller-form/vehicle-seller-form.component';
import {VehicleListElementComponent} from '../vehicle-list-element/vehicle-list-element.component';
import {dateRangeValidator} from '../../../services/validators/date-validator.service';

@Component({
  selector: 'app-vehicle-seller',
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    VehicleSellerFormComponent,
    VehicleListElementComponent,
    NgIf
  ],
  templateUrl: './vehicle-seller.component.html',
  styleUrl: './vehicle-seller.component.css'
})

export class VehicleSellerComponent implements OnInit{


  constructor(private readonly vehicleService: VehicleService,
              private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      user_id: [-1],
      category:[1,Validators.required],
      mark:["",Validators.required],
      model:["",Validators.required],
      type:["",Validators.required],
      name:['',Validators.required],
      description:[''],
      price:[null,Validators.required],
      first_registration:[null,Validators.required,dateRangeValidator()],
      mileage:[],
      fuel_type:[''],
      color:[''],
      condition:['New'],
      images:[null]
    })
  }
  form:any

  newVehicle!: Vehicle
  vehicles!: Vehicle[]
  vehicleListVisible: boolean = true

  ngOnInit() {
    this.getVehicles()
  }

  createVehicle(){
    if(this.form.valid){
      let vehicle = this.form.value
      this.newVehicle = new Vehicle(0,vehicle.user_id,
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
        "Open")

      const formData = new FormData();
      formData.append('vehicle',JSON.stringify(this.newVehicle))
      vehicle.images.forEach((image: File) =>{
        formData.append('images',image);
      })

      this.vehicleService.createVehicle(formData).subscribe({
        next: (response) =>{
          console.log('Vehicle created', response);
          this.getVehicles()
        },
        error: (err) => {
          console.error('Error:', err)
        }
      })
    }
  }

  getVehicles(){
    this.vehicleService.getUserVehicle().subscribe({
      next: (response)=>{
        this.vehicles = response;
      },
      error:(err)=>{
        console.error('Error:', err)
      }
    })
  }

  deleteVehicle(id:number){
    this.vehicleService.deleteVehicle(id).subscribe({
      next: ()=>{
        this.vehicles = this.vehicles.filter(vehicle => vehicle.vehicle_id !== id);
        console.log('Vehicle deleted successfully')
      },
      error:(err)=>{
        console.error('Error deleting vehicle:', err)
      }
    })
  }

  markAsSold(vehicle:Vehicle){
    vehicle.markAsSold()
    const formData = new FormData();
    formData.append('vehicle',JSON.stringify(vehicle))
    this.vehicleService.updateVehicle(vehicle.vehicle_id, formData).subscribe({
      next:()=>{
        console.log('Vehicle updated successfully');
      },
      error: (error)=>{
        console.error('Error:', error)
      }
    })
  }

  markAsOpen(vehicle:Vehicle){
    vehicle.markAsOpen()
    const formData = new FormData();
    formData.append('vehicle',JSON.stringify(vehicle))
    this.vehicleService.updateVehicle(vehicle.vehicle_id, formData).subscribe({
      next:()=>{
        console.log('Vehicle updated successfully');
      },
      error: (error)=>{
        console.error('Error:', error)
      }
    })
  }

  protected readonly asNativeElements = asNativeElements;
}
