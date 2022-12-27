import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories } from '../_helpers/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  apiUrl = 'http://localhost:3000/categories/';
  constructor(private _http: HttpClient) { }

  // category add update edit delete method
  createCategories(data: Categories) {
    return this._http.post(this.apiUrl, data);
  }
  getAllCategories(): Observable<Categories[]> {
    return this._http.get<Categories[]>(this.apiUrl);
  }
  deleteCategories(id: Categories) {
    return this._http.delete(this.apiUrl + id);
  }
  updateCategories(id: any, data: any) {
    return this._http.put(this.apiUrl + id, data);
  }
  // end of category add update edit delete method
}


