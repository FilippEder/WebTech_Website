import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Model} from '../../models/vehicle-models/Model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private readonly apiURL = 'http://localhost:3000/model';

  constructor(private readonly http: HttpClient) {
  }

  //Get Model for corresponding mark id
  getModel(markId:string):Observable<Model[]>{
    return this.http.get<any[]>(this.apiURL+`/${markId}`).pipe(
      map((response:any[])=>{
        return response.map(model => new Model(model.model_id, model.mark_id, model.name))
      })
    )
  }

  //Get single Model by corresponding model id
  getModelById(id:number):Observable<Model>{
    return this.http.get<Model>(this.apiURL+`/single/${id}`);
  }
}
