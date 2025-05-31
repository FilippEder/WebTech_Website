import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../../../models/vehicle-models/Vehicle';
import {VehicleService} from '../../../services/vehicle/vehicle.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {VehicleListElementComponent} from '../vehicle-list-element/vehicle-list-element.component';
import {Model} from '../../../models/vehicle-models/Model';
import {Mark} from '../../../models/vehicle-models/Mark';
import {Type} from '../../../models/vehicle-models/Type';
import {MarkService} from '../../../services/mark/mark.service';
import {ModelService} from '../../../services/model/model.service';
import {TypeService} from '../../../services/type/type.service';
import {debounceTime, Subject} from 'rxjs';

@Component({
  selector: 'app-vehicle-buyer',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    RouterLink,
    VehicleListElementComponent
  ],
  templateUrl: './vehicle-buyer.component.html',
  styleUrl: './vehicle-buyer.component.css'
})
export class VehicleBuyerComponent implements OnInit{

  vehicles: Vehicle[] = []
  marks: Mark[] = []
  models: Model[] = []
  types: Type[] = []
  attributes: Map<string,any> = new Map<string, string>()
  searchUpdated = new Subject<void>()

  constructor(
    private readonly vehicleService:VehicleService,
    private readonly markService:MarkService,
    private readonly modelService:ModelService,
    private readonly typeService:TypeService
  ) {
    this.attributes.set('vehicle_category_id','1')
    this.attributes.set('status','Open')

    this.searchUpdated.pipe(debounceTime(500)).subscribe(()=>{
      this.getVehicles()
    })
  }

  ngOnInit() {
    this.getVehicles()
    this.getMarks('1')
    this.getTypes('1')

  }


  getVehicles(){
    console.log(this.attributes)
    this.vehicleService.getVehicleByQuery(this.attributes).subscribe({
      next: (response)=>{
        this.vehicles = response;
      },
      error:(err)=>{
        console.error('Error:', err)
      }
    })
  }

  getMarks(categoryId:string){
    if(categoryId!="")
      this.markService.getMark(categoryId).subscribe({
        next: (response)=>{
          this.marks = response;
        },
        error:(err)=>{
          console.error('Error',err)
        }
      })
  }

  getModels(markId:string){
    if(markId!="")
      this.modelService.getModel(markId).subscribe({
        next: (response) =>{
          this.models = response;
        },
        error:(err)=>{
          console.error('Error',err)
        }
      })
  }

  getTypes(categoryId:string){
    if(categoryId!="")
      this.typeService.getType(categoryId).subscribe({
        next: (response) =>{
          this.types = response;
        },
        error:(err)=>{
          console.error('Error',err)
        }
      })
  }

  updateMap(key:string,event:Event){
    let target = (event.target as HTMLInputElement)
    if(target.value){
      this.attributes.set(key,target.value)
    }else{
      this.attributes.delete(key)
    }

    if (target.tagName === 'SELECT' || target.type === 'date' || target.type === 'number'){
      this.getVehicles();
    } else{
      this.searchUpdated.next();
    }
  }

  onCategoryChange(event:Event){
    let categoryId=(event.target as HTMLInputElement).value
    this.getMarks(categoryId)
    this.getTypes(categoryId)
    this.models = []
    this.clearSelection('mark')
    this.attributes.delete('mark_id')
    this.clearSelection('model')
    this.attributes.delete('model_id')
    this.clearSelection('type')
    this.attributes.delete('type_id')
  }

  onMarkChange(event:Event){
    let markId=(event.target as HTMLInputElement).value
    this.getModels(markId)
  }

  clearSelection(selectId:string){
    const selectedElement:HTMLInputElement = (document.getElementById(selectId)as HTMLInputElement)
    selectedElement.value = "";
  }

  preventSigns(event: KeyboardEvent){
    if(event.key === '-' || event.key === '+'){
      event.preventDefault()
    }
  }
}
