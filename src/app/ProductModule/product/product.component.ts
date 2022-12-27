import { ProductsService } from './../_shared/products.service';
import { Products } from './../_helpers/product.interface';
import { CategoriesService } from './../_shared/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Categories } from '../_helpers/categories.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  categories!: Categories[]; // dropdown categories varialble
  // forms using varialble
  productsForm!: FormGroup;
  productObj!: Products;
  productsData: Products[] = [];
  currentCategoryId!: number;
  currentCatElm!: any;
  isDataExists: boolean = false;
  // using only add and update button
  btnSaveShow: boolean = true;
  btnupdateShow: boolean = false;
  searchText!: any; // search input
  //pagination varialble
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  @ViewChild('closebutton') closebutton: any; //close buttton
  //sorting
  sortFiled: { sortOrder: number; filedName: string } | undefined;

  constructor(
    private _categoriesServices: CategoriesService,
    private toastr: ToastrService,
    private _formBulider: FormBuilder,
    private _productService: ProductsService
  ) {
    this.sortFiled = { sortOrder: 1, filedName: 'id' };
  }

  ngOnInit(): void {
    this.productsForm = this._formBulider.group({
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      categories: ['', Validators.required],
      pro_price: ['', Validators.required],
    });
    this.getCategoriesData(); //categories
    this.getProductsData(); //products
  }

  get f() {
    return this.productsForm.controls;
  } //validation purpose

  // Dropdown get the Categories
  getCategoriesData() {
    this._categoriesServices.getAllCategories().subscribe(
      (res: any) => {
        this.categories = res;
      },
      (err) => {
        this.toastr.error('something Wrong');
      }
    );
  }
  // add and submit products
  onSubmitProducts() {
    debugger;
    if (this.productsForm.valid) {
      this.productObj = {
        id: this.productsForm.value.id,
        productName: this.productsForm.value.productName,
        productCode: this.productsForm.value.productCode,
        categories: this.productsForm.value.categories,
        pro_price: this.productsForm.value.pro_price,
      };
      this.isDataExists = this.checkProductData(this.productsForm.value);
      if (this.isDataExists == true) {
        this.toastr.error('Product is already Exitsts!');
        this.isDataExists = false;
      } else {
        this._productService.createProducts(this.productObj).subscribe(
          (res: any) => {
            console.log(res);
            this.toastr.success('Product Sumbitted!');
            this.closebutton.nativeElement.click();
            let ref = document.getElementById('clear');
            ref?.click();
            this.productsForm.reset(); // reset form
            this.getProductsData(); // using update and display Product
          },
          (err) => {
            this.toastr.error('Server side something Wrong');
          }
        );
      }
    }
  }

  // check database not enter the duplicate value method
  checkProductData(element: any) {
    let checkNewData = this.productsData;
    console.log(checkNewData);
    for (let i = 0; i < checkNewData.length; i++) {
      if (
        checkNewData[i].productCode == element.productCode ||
        checkNewData[i].productName == element.productName
      ) {
        this.isDataExists = true;
      }
    }
    return this.isDataExists;
  }

  // display Products data method
  getProductsData() {
    this._productService.getAllProducts().subscribe(
      (res: any) => {
        this.productsData = res;
      },
      (err) => {
        this.toastr.error('something Wrong');
      }
    );
  }

  // edit Product data method
  onEditProduct(data: Products) {
    this.btnSaveShow = false;
    this.btnupdateShow = true;
    this.currentCategoryId = data.id;
    this.currentCatElm = this.productsData.find(
      (elmId) => elmId.id === data.id
    );
    this.productsForm.controls['productCode'].setValue(data.productCode);
    this.productsForm.controls['productName'].setValue(data.productName);
    this.productsForm.controls['categories'].setValue(data.categories);
    this.productsForm.controls['pro_price'].setValue(data.pro_price);
    console.log(this.currentCatElm);
  }

  // update Product data method
  updateProducts() {
    this._productService
      .updateProducts(this.currentCategoryId, this.productsForm.value)
      .subscribe(
        (res) => {
          this.toastr.success('Category Record Updated!');
          this.closebutton.nativeElement.click();
          let ref = document.getElementById('clear');
          ref?.click();
          this.btnupdateShow = false;
          this.btnSaveShow = true;
          this.productsForm.reset(); // reset form
          this.getProductsData(); // using update and display Product
        },
        (err) => {
          this.toastr.error('something Wrong');
        }
      );
  }

  // delete Product data method
  deleteProduct(data: any) {
    this._productService.deleteProducts(data.id).subscribe(
      (res) => {
        this.toastr.success('Category Record Deleted!');
        this.getProductsData();
      },
      (err) => {
        this.toastr.error('something Wrong');
      }
    );
  }

  // sorting the datatable method
  sortByFiled(filedName: string): void {
    if (this.sortFiled?.filedName === filedName) {
      this.sortFiled.sortOrder = this.sortFiled.sortOrder == 1 ? -1 : 1;
    } else {
      this.sortFiled = { filedName: filedName, sortOrder: 1 };
    }
    this.productsData = this.productsData.sort((a: any, b: any) => {
      if (this.sortFiled?.sortOrder == -1) {
        if (b[filedName] < a[filedName]) {
          return -1;
        }
        if (b[filedName] > a[filedName]) {
          return 1;
        }
        return 0;
      } else {
        if (a[filedName] < b[filedName]) {
          return -1;
        }
        if (a[filedName] > b[filedName]) {
          return 1;
        }
        return 0;
      }
    });
  }

  //pagination ----
  //pagination custom method
  onTableDataChange(event: any) {
    this.page = event;
    this.getCategoriesData();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCategoriesData();
  }
}
