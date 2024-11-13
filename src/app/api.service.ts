import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  PHP_API_SERVER = 'http://localhost/ang-php-mysql/api';
  constructor(private httpClient: HttpClient) {}
  readProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.PHP_API_SERVER}/index.php`);
  }
  createProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(
      `${this.PHP_API_SERVER}/create_product.php`,
      product
    );
  }
  updateProduct(product: Product) {
    return this.httpClient.put<Product>(
      `${this.PHP_API_SERVER}/update_product.php`,
      product
    );
  }
  deleteProduct(id: number) {
    return this.httpClient.delete<Product>(
      `${this.PHP_API_SERVER}/delete_product.php/?id=${id}`
    );
  }
}
