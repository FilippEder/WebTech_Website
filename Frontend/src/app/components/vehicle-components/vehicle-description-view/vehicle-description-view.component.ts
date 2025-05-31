import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../../../models/vehicle-models/Vehicle';
import {VehicleService} from '../../../services/vehicle/vehicle.service';
import {ActivatedRoute} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Model} from '../../../models/vehicle-models/Model';
import {Mark} from '../../../models/vehicle-models/Mark';
import {Type} from '../../../models/vehicle-models/Type';
import {MarkService} from '../../../services/mark/mark.service';
import {ModelService} from '../../../services/model/model.service';
import {TypeService} from '../../../services/type/type.service';
import {Picture} from '../../../models/vehicle-models/Picture';
import {User} from '../../../models/login-models/User';

@Component({
  selector: 'app-vehicle-description-view',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './vehicle-description-view.component.html',
  styleUrl: './vehicle-description-view.component.css'
})
export class VehicleDescriptionViewComponent implements OnInit{

  vehicle!:Vehicle
  pictures?:Picture[]
  mark:Mark = new Mark(0,0,"-")
  model:Model = new Model(0,0,"-")
  type:Type = new Type(0,0,"-")
  user?:User
  requestSent:boolean = false;

  constructor(
    private readonly vehicleService:VehicleService,
    private readonly markService: MarkService,
    private readonly modelService: ModelService,
    private readonly typeService: TypeService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    let id = +this.route.snapshot.paramMap.get('id')!
    this.getVehicle(id);
  }

  getVehicle(id:number){
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle:any) =>{
        console.log(vehicle)
        this.vehicle = vehicle;
        if(this.vehicle.mark_id != null)
        this.getMark(this.vehicle.mark_id)
        if(this.vehicle.model_id != null)
        this.getModel(this.vehicle.model_id)
        if(this.vehicle.type_id != null)
        this.getType(this.vehicle.type_id)
        if(this.vehicle.vehicle_pictures){
          this.pictures = vehicle.vehicle_pictures
        }
        this.user = vehicle.user
      },
      error:(error)=>{
        console.error('Error:', error)
      }
    })
  }

  getMark(id:number){
    this.markService.getMarkById(id).subscribe({
      next:(mark)=>{
        this.mark = mark;
      },
      error:(error)=>{
        console.error('Error:',error)
      }
    })
  }

  getModel(id:number){
    this.modelService.getModelById(id).subscribe({
      next:(model)=>{
        this.model = model;
      },
      error:(error)=>{
        console.error('Error:',error)
      }
    })
  }

  getType(id:number){
    this.typeService.getTypeById(id).subscribe({
      next:(type)=>{
        this.type = type;
      },
      error:(error)=>{
        console.error('Error:',error)
      }
    })
  }

  sendRequest(vehicleId: number) {
    this.vehicleService.createRequest(vehicleId)
      .subscribe(
        response => {
          this.requestSent = true
          console.log('Request erfolgreich gesendet:', response);
          // Hier kannst du z. B. eine Erfolgsmeldung anzeigen
        },
        error => {
          console.error('Fehler beim Senden des Requests:', error);
          // Hier kannst du den Fehler behandeln
        }
      );
  }
}
