import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../_helpers/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = 'http://localhost:3000/products/';

  constructor(private _http: HttpClient) {}
  // product add update edit delete method
  createProducts(data: Products) {
    return this._http.post(this.apiUrl, data);
  }
  getAllProducts(): Observable<Products[]> {
    return this._http.get<Products[]>(this.apiUrl);
  }
  deleteProducts(id: Products) {
    return this._http.delete(this.apiUrl + id);
  }
  updateProducts(id: any, data: any) {
    return this._http.put(this.apiUrl + id, data);
  }
}
