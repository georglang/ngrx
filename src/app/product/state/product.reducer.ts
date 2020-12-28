import {
  createReducer,
  on,
  createAction,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { Product } from '../product';
import * as AppState from './../../state/app.state';

import * as ProductActions from './product.actions';

export interface State extends AppState.State {
  products: ProductState;
}

export interface ProductState {
  showProductCode: boolean;
  currentProduct: Product;
  products: Product[];
}

const initialState: ProductState = {
  showProductCode: true,
  currentProduct: null,
  products: [],
};

// Feature Selector - gets the product slice of state
const getProductFeatureState = createFeatureSelector<ProductState>('products');

// Create Selector
export const getShowProductCode = createSelector(
  getProductFeatureState,
  (state) => state.showProductCode // state - is the products slice of state
);

export const getCurrentProduct = createSelector(
  getProductFeatureState,
  (state) => state.currentProduct
);

export const getProducts = createSelector(
  getProductFeatureState,
  (state) => state.products
);

// Create a Reducer
export const productReducer = createReducer<ProductState>(
  initialState,
  on(
    ProductActions.toggleProductCode,
    (state): ProductState => {
      return {
        ...state,
        showProductCode: !state.showProductCode,
      };
    }
  )
);

// on-function for each action this reducer handles
