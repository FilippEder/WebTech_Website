import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Vehicle} from '../../models/vehicle-models/Vehicle';
import {map, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly request_url = 'http://localhost:3000';
  private readonly apiURL = 'http://localhost:3000/vehicle';
  private readonly REQUESTS_ENDPOINT = '/api/immobilien/requests';

  constructor(private readonly http: HttpClient) {
  }

  createVehicle(formData: FormData){
    return this.http.post<FormData>(this.apiURL, formData);
  }

  getVehicleByQuery(attributes:Map<string,string>):Observable<Vehicle[]>{
    let queryUrl = 'http://localhost:3000/vehicle?'
    let count = 0

    for(const [key, value] of attributes.entries()){
      queryUrl += `${key}=${value}`
      count++
      if(count < attributes.size){
        queryUrl+= '&'
      }
    }

    return this.http.get<any[]>(queryUrl).pipe(
      map((response:any[])=> this.mapToVehicles(response))
    )
  }

  mapToVehicles(response:any[]):Vehicle[]{
    return response.map(vehicle => new Vehicle(
      vehicle.vehicle_id,
      vehicle.user_id,
      vehicle.vehicle_category_id,
      vehicle.mark_id,
      vehicle.model_id,
      vehicle.type_id,
      vehicle.name,
      vehicle.description,
      vehicle.price,
      vehicle.first_registration,
      vehicle.mileage,
      vehicle.fuel_type,
      vehicle.color,
      vehicle.condition,
      vehicle.status,
      vehicle.vehicle_pictures
    ))
  }

  getVehicleById(id:number):Observable<Vehicle>{
    return this.http.get<Vehicle>(this.apiURL+`/${id}`);
  }

  getUserVehicle():Observable<Vehicle[]>{
    return this.http.get<any[]>(this.apiURL+'/user').pipe(
      map((response:any[])=> this.mapToVehicles(response))
    )
  }

  updateVehicle(id:number, formData:FormData):Observable<Vehicle>{
    return this.http.patch<Vehicle>(this.apiURL+`/${id}`,formData)
  }

  deleteVehicle(id:number){
    return this.http.delete<void>(this.apiURL+`/${id}`)
  }

  deletePicture(id:number){
    return this.http.delete(this.apiURL+`/picture/${id}`)
  }

  createRequest(vehicleId: number): Observable<any> {
    const payload = {
      listing_id: vehicleId,
      listing_type: 'Vehicle'
    };

    return this.http.post<any>(`${this.request_url}${this.REQUESTS_ENDPOINT}`, payload);
  }

}
