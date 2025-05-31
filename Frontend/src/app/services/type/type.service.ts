import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Type} from '../../models/vehicle-models/Type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private readonly apiURL = 'http://localhost:3000/type';

  constructor(private readonly http: HttpClient) {
  }

  //Get Type for corresponding category id
  getType(categoryId:string):Observable<Type[]>{
    return this.http.get<any[]>(this.apiURL+`/${categoryId}`).pipe(
      map((response:any[])=>{
        return response.map(type => new Type(type.type_id, type.vehicle_category_id, type.name))
      })
    )
  }

  //Get single Type by corresponding type id
  getTypeById(id:number):Observable<Type>{
    return this.http.get<Type>(this.apiURL+`/single/${id}`);
  }
}
