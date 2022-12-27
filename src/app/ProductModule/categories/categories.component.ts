import { CategoriesService } from './../_shared/categories.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Categories } from '../_helpers/categories.interface';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  // forms using varialble
  categoriesForm!: FormGroup;
  categoriesObj!: Categories;
  categoriesData: Categories[] = [];
  currentCategoryId!: any;
  // using only add and update button
  btnSaveShow: boolean = true;
  btnupdateShow: boolean = false;
  //pagination varialble
  p: number = 1;
  count: number = 5;
  //search
  searchText: string = '';
  filteredCategory: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _categorieServices: CategoriesService,
    private toastr: ToastrService
  ) {}
  //controls get for validation
  get f() {
    return this.categoriesForm.controls;
  }

  ngOnInit(): void {
    this.categoriesForm = this._formBuilder.group({
      catName: ['', Validators.required],
    });
    this.getCategoriesData(); // get data method
  }
  // Add and Sumbit Categories Method---
  onSubmitCategories() {
    if (this.categoriesForm.valid) {
      this.categoriesObj = {
        id: 0,
        catName: this.categoriesForm.value.catName,
      };
      this._categorieServices.createCategories(this.categoriesObj).subscribe(
        (res: any) => {
          this.toastr.success('Category Record Sumbitted!');
          this.categoriesForm.reset(); // reset form
          this.getCategoriesData(); // using update and display categories
        },
        (err) => {
          this.toastr.error('Server side something Wrong');
        }
      );
    }
  }
  // display categories data method
  getCategoriesData() {
    this._categorieServices.getAllCategories().subscribe(
      (res: any) => {
        this.categoriesData = res;
      },
      (err) => {
        this.toastr.error('something Wrong');
      }
    );
  }
  // edit categories data method
  onEditCategories(data: Categories) {
    this.currentCategoryId = data.id;
    this.btnSaveShow = false;
    this.btnupdateShow = true;
    this.categoriesData.find((elmId) => elmId.id === data.id);
    this.categoriesForm.controls['catName'].setValue(data.catName);
  }
  //update categories data method
  updateCategories() {
    this._categorieServices
      .updateCategories(this.currentCategoryId, this.categoriesForm.value)
      .subscribe(
        (res) => {
          this.toastr.success('Category Record Updated!');
          this.btnupdateShow = false;
          this.btnSaveShow = true;
          this.categoriesForm.reset();
          this.getCategoriesData();
        },
        (err) => {
          this.toastr.error('something Wrong');
        }
      );
  }
  // delete categories data method
  deleteCategories(data: any) {
    this._categorieServices.deleteCategories(data.id).subscribe(
      (res) => {
        this.toastr.success('Category Record Deleted!');
        this.getCategoriesData();
      },
      (err) => {
        this.toastr.error('something Wrong');
      }
    );
  }

  // search filter method by custom method
  searchKey() {
    if (this.filteredCategory.length) {
      this.categoriesData = this.filteredCategory;
    }
    this.filteredCategory = this.categoriesData;
    this.search();
  }
  search() {
    console.log(this.categoriesData);
    this.categoriesData =
      this.searchText === ''
        ? this.categoriesData
        : this.categoriesData.filter((element: any) => {
            return element.name.toLowerCase() == this.searchText.toLowerCase();
          });
    console.log(this.categoriesData);
  }
}
