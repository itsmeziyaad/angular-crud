import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Product } from '../product';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product = { id: 0, name: '', price: 0 };

  productForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    // Initializing the form group with validations
    this.productForm = this.fb.group({
      id: [this.selectedProduct.id],
      name: [this.selectedProduct.name, Validators.required],
      price: [
        this.selectedProduct.price,
        [Validators.required, Validators.min(0)],
      ],
    });

    // Fetch products from API on component initialization
    this.apiService.readProducts().subscribe((products: Product[]) => {
      this.products = products;
      console.log(this.products);
    });
  }

  ngOnInit() {}

  createOrUpdateProduct() {
    const formValue = this.productForm.value;
    if (this.selectedProduct && this.selectedProduct.id) {
      this.apiService.updateProduct(formValue).subscribe((product: Product) => {
        console.log('Product updated', product);
        this.apiService.readProducts().subscribe((products: Product[]) => {
          this.products = products;
        });
      });
    } else {
      this.apiService.createProduct(formValue).subscribe((product: Product) => {
        console.log('Product created', product);
        this.apiService.readProducts().subscribe((products: Product[]) => {
          this.products = products;
        });
      });
    }
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    // Set form values when a product is selected
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe(() => {
      console.log('Product deleted');
      this.apiService.readProducts().subscribe((products: Product[]) => {
        this.products = products;
      });
    });
  }
}
