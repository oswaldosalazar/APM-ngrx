import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import * as productActions from '../state/product.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  componentActive = true;
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  constructor(
    private store: Store<fromProduct.State>,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.products$ = this.store.pipe(select(fromProduct.getProducts));
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    this.store.dispatch(new productActions.Load());
    // TODO: Unsubscribe
    this.store.pipe(
      select(fromProduct.getCurrentProduct),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    // ,takeWhile(() => this.componentActive))
    // .subscribe((products: Product[]) => this.products = products);

    // this.productService.getProducts().subscribe({
    //   next: (products: Product[]) => (this.products = products),
    //   error: err => (this.errorMessage = err)
    // });

    // TODO: Unsubscribe
    this.store.pipe(
      select(fromProduct.getShowProductCode),
      takeWhile(() => this.componentActive)
    ).subscribe(
      showProductCode => this.displayCode = showProductCode
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(
      new productActions.InitializeCurrentProduct()
    );
  }

  productSelected(product: Product): void {
    this.store.dispatch(
      new productActions.SetCurrentProduct(product)
    );
  }
}
