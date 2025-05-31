import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Mark} from '../../models/vehicle-models/Mark';

@Injectable({
  providedIn: 'root'
})
export class MarkService {
  private readonly apiURL = 'http://localhost:3000/mark';

  constructor(private readonly http: HttpClient) {
  }

  //Get Marks for corresponding category id
  getMark(categoryId:string):Observable<Mark[]>{
    return this.http.get<any[]>(this.apiURL+`/${categoryId}`).pipe(
      map((response:any[])=>{
        return response.map(mark => new Mark(mark.mark_id, mark.vehicle_category_id, mark.name))
      })
    )
  }

  //Get single Mark by corresponding mark id
  getMarkById(id:number):Observable<Mark>{
    return this.http.get<Mark>(this.apiURL+`/single/${id}`);
  }

}
