import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getShowProductCode,
  ProductState,
  State,
} from './state/product.reducer';

import * as ProductActions from './state/product.actions';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public displayCode = false;
  constructor(private store: Store<State>) {}

  ngOnInit() {
    // ToDo: Unsubscribe
    this.store
      .select(getShowProductCode)
      .subscribe((showProductCode) => (this.displayCode = showProductCode));
  }

  checkChange(): void {
    this.store.dispatch(ProductActions.toggleProductCode());
  }
}
