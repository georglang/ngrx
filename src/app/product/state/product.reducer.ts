import {
  createReducer,
  on,
  createAction,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { Product } from '../product';
import * as AppState from './../../state/app.state';

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

// Create a Reducer
export const productReducer = createReducer<ProductState>(
  initialState,
  on(
    createAction('[Product] Toggle Product Code'),
    (state): ProductState => {
      console.log('original state: ', JSON.stringify(state));

      return {
        ...state,
        showProductCode: !state.showProductCode,
      };
    }
  )
);

// on-function for each action this reducer handles
