
import { ProductComponent } from './ProductModule/product/product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './ProductModule/categories/categories.component';

const routes: Routes = [
  {path:'',component:ProductComponent},
  {path:'categories',component:CategoriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
