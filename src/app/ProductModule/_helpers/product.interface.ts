import { Categories } from "./categories.interface";

export interface Products {
  id: number;
  productName: string;
  productCode: string;
  categories: Categories;
  pro_price:number;
}
