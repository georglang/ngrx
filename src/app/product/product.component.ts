import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public displayCode = false;
  constructor(private store: Store<any>) {}

  ngOnInit() {
    // ToDo: Unsubscribe
    this.store.select('products').subscribe((products) => {
      if (products) {
        this.displayCode = products.showProductCode;
      }
    });
  }

  checkChange(): void {
    this.store.dispatch({
      type: '[Product] Toggle Product Code',
    });
  }
}
