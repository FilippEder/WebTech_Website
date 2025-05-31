import {Picture} from './Picture';

export class Vehicle{

constructor(
  public vehicle_id:number=0,
  public user_id:number,
  public vehicle_category_id:number,
  public mark_id:number,
  public model_id:number,
  public type_id:number,
  public name: string,
  public description: string,
  public price: number,
  public first_registration: Date,
  public mileage: number,
  public fuel_type: string,
  public color: string,
  public condition: string,
  public status:string,
  public vehicle_pictures:Picture[] = []
) {}

  markAsSold(){
    this.status='Sold'
  }

  markAsOpen(){
    this.status='Open'
  }
}
