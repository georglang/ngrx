import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { StoreModule } from '@ngrx/store';
import { productReducer } from './state/product.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('products', productReducer)],
  declarations: [ProductComponent],
  exports: [ProductComponent],
})
export class ProductModule {}
