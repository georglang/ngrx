# ngrx

Learning ngrx https://ngrx.io/

# What is state

- Information about the view, such as displaing fields or specific UI elements
- User information, such as the users name and roles
- Entity Data, such as product information that is traditionally stored on a backend server somewhere
- User Selection and input

# Purpose of NgRx

Provide a pattern for:

- Organizing state into one single local state container
- Managing a state by requiering a one was data flow
- Communicating state changes to the components

# What is NgRx

- It´s the popular state management pattern called redux adopted to Angular
- Redux pattern helps to manage the application state by providing a one way data flow throughout the application

# Redux Pattern

Redux is a predictable state container for JavaScript apps
It becomes the dominant state management pattern for SPAs

## Three Principles

- One single source of truth for application state called store
- State is read only and only changed by dispatching actions
- Changes to the store are made using pure functions called reducers

## Store

The Store is a JavaScript Object, that holds all your application state, it´s like a client side database

- The store provides a place for UI state to retain it between router views
- The ngrx store provides a client side cache, so we don´t need to re-get the data from the server everytime a component is initialized

- Interact with store state in an immutable way, replacing the state instead of modifing the state structure or values

_Best practices:_

- We don´t want one big global state
- Rather than, we organize our state into feature slices e.g. `users: {}, products: {}, customers: {}`,  
  this keeps the state associated with it´s feature module and makes it easier to manage and find the state

### Important

- Organizing application state by feature
- Name each feature slice with the feature name
- Initalize the store, both in the root application module `StoreModule.forRoot(reducer)` and in each Feature Module
  that uses the store. `StoreModule.forFeature('feature', featureReducer)`

### What Should Not Go In The Store

- Unshared state, state that is only owned by a single component and have not to be shared between multiple components
- Angular form state
- Non serializable state e.g the router state

# Action

All relevant user events are dispatched as actions.  
Actions are events that have a type property, describing the action and can have optional data associating with them

- An action represents an event that changes the state of the application, such as the user selecting a box or an item.
- Define an action for each event worth tracking, don´t track events local to a component

```
{
  type: 'login',
  user: { username: 'Georg', password: 'secret'}
}
```

If you need to change the state of the store, than replace the whole state object and not just mutate part of it.

**Examples:**

- Login action after a login form submission
- Toogle side menu action after button click
- Retrieve data action when initalizing a component
- Start global spinner action wehn saving data

### Dispatching an Action

- Often done in response to a user action
- Before we can dispatch an action from a component, we must inject the store into that component
- Call the dispatch action of the store `this.store.dispatch()`
- Pass in the action to dispatch
- The action is dispatched to all reducers and processed by any matching on-functions

```
// the generic type argument must be <any>
constructor(private store: Store<any>)

// dispatch an action
this.store.dispatch({
  type: '[Product] Toggle Product Code',
});
```

# Strongly Typing Actions with Action Creators

## Action Creators using createAction

```
export const toogleProductCode = createAction('[Product] Toggle Product Code');
```

_'[Product] Toggle Product Code'_ a clear descriptive string as the action type.  
This action type shows up in the Chrome DevTools.

### Naming

- [Product] Begin each action type with the name of it´s slice of state that is affected by the action
- _'Toggle Product Code'_ a unique and descriptive name
- The first part could be more descriptive by including the name of the Page,  
  or the API e.g. '[Product Edit Page] Clear Current Product', '[Product API] Load Success' that dispatches the Action, that provides a better context of the event source.   
  **Makes it easier to determine where the action was dispatched.**    

```
// product.reducer.ts
// Use constant in reducer
export const productReducer = createReducer(
  initialState,
  on(toggleProductCode, state => {
    return { ... };
  })
)
```

```
// Use constant when dispatching an action
this.store.dispatch(toggleProductCode());
```

## Define Actions with Data 
Some Action Requiere Associated Data   

```
export const setCurrentProduct = createAction(
  '[Product] Set Current Product',
  props<{product: Product}>()
)
```

# Component Communication (NgRx-Way with Actions and Selectors)
**Example:**

- When a user selects a product, the products-list.component dispatches a setCurrentProduct action    
- The reducer processes that action and updates the store with the currently 
selected product 
- The product added in product-list.component subscribes through a selector to receive change notifications.
- When they receive the notification, they modify their local properties and their  
views are updated with their selection

Use Actions and Selectors to communicate the current product selection to multiple components


# Reducer

Reducers provide a representation of our application state

- Responds to dispatched actions
- Replaces the reducers slice of state with new state based on the action
- Build a reducer function (often one per feature)
- Implementing by `createReducer()`
- Spread the state as needed. This copies the existing state to a new object an allows updating that copy,
  before overwriting the existing stores state with that copy

Reducers are functions that specify how state changes in response to an action.

Reducers are responsible for handling transitions from one state to the next state.  
Reducer function handle this transitions by determining which action to handle based on the actions type.

Reducers are pure functions and handle each state transition synchronously. Each reducer function takes the initial state and a selection of functions that handle state changes for their associated actions.

This functions take the current state and an action return new state.

```
export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state, action) => {
    return {
      ...state,
      user: action.user
    }
  })
)
```

### What is a pure function

A pure function is a function that given the same arguments will always return the same value with no observable side effects.

Pure functions will not mutate or access properites outside of their function scope

**Example:**

```
// Pure Function
function sum(a, b) {
  const result = a + b;
  return result
}
```

```
// Impure Function
let c = 1;

function sum (a, b) {
  result = a + b + c;
  return result;
}
```

This is an impure function because it depends on outside variables.

**Examples:**

- Set a user details property on login
- Toggle a sideMenuVisible property to true on button click
- Set successfully retrieved data on component initialization

Not all dispatched actions can directly update the store by the reducer because some actions have side effects

The reducer updates the store and the store notifies all subscribers

# Store

## Subscribing to a store to get state changes

To access a value in the store, we select the appopriate slice of state.

- Often done in the `ngOninit()` lifecycle hook
- Inject the store in the components constructor
- Use the store´s select function, passing in the desired slice of state
- Subscribe to get the current stored values `this.store.select('products'),subscribe()`
- The component receives notifications whenever the selected slice of state changes

```
this.store.select('products');

// the argument of select is name of the slice of state
```

The ngrx select method and select operator both return a slice of state as an Observable.
To notify the component about a state change subscribe to this Observable.

## Unsubscribing from a store

1. Approach: Store the subscription in a variable and unsubscribe it in ngOnDestroy()
   -> It´s not handy if you have a lot of subscriptions

# Advantages Of The Redux Pattern

- Having a centralized immutable state tree makes state changes more explicit and predictable
- Performance improvment with onPush
- Better Testability
- Tooling: Redux makes it possible to have a history of state changes
- Simpler component communication: NgRx makes it easy to access shared state by injecting the store into a component versus passing data between components.

# Initialize Store

- Organize the state by Feature Modules
- To create the state define multiple _Reducers_, one for each feature module slice of state. Each reducer is than smaller and more focused, easier to build, maitain and test.
- It is the combination of the reducers that represent the application state at any given time

## Feature Module State Composition

Allows us to compose your application state from our feature module reducers

### Sub-slice State

A state e.g. product could be sliced into sub-slices
_productList and productData_ are smaller slices

So we define a reducer for each sub-slice of state.  
These reducers are aggregated for their associated feature.

It´s useful when a single feature has lots of state, allowing us to
break our reducers into smaller pieces.

```
// State in store

products : {  // feature slice
  productList: {
    showProductCode: true
  },
  productData: {
    products: [...]
  }
}

// initializing store in Feature Module (Product Module)

Store.Module.forFeature('products',
  productList: listReducer,     // key is the name for each sub slice of state and the value is a reference to its associated reducer
  productData: dataReducer
)
```

# Strongly Typing the State

- Use TypeScript interfaces to define a interface for each slice of state

```
// slice of state for product
export interface ProductState {
  showProductCode: boolean;
  currentProduct: Product;
  products: Product[]
}

// slice of state for user
export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

// use it within the global state
export interface State {
  products: ProductState;
  users: UserState;
}
```

- Define the feature state interfaces in their associated reducers

## Typed reducers and initial state

```
// product.reducer.ts

const initialState: ProductState = {
  showProductCode: true,
  currentProduct: null,
  products: []
};

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

```

# Developer Tools and Debugging

## Redux DevTools Browser Extension

- Install Chrome Extension Redux DevTools
- Install @ngrx/store-devtools

# Lazy Loading

- When setup a Feature Module for Lazy Loading that module is independently bundled
- When the user accesses the application it is downloaded from the server, separate from our main application bundle
- This improved the application startup performance

## What does Lazy Loading have to do with the state interface

When loading a Module with Lazy Loading, we need a special technique to let
Lazy Loading intact:

```
// app.state.ts
export interface State {
  users: UserState;
}
```

```
// product.state.ts
// Product Module is loaded with Lazy Loading

import * as AppState from '...'
export interface ProductState extends AppState.State {
  products: ProductState;
}
```

# Selectors

ToDo: Insert Selector img

Docs:  
"Selectors are pure functions used for obtaining slices of store state. @ngrx/store provides a few helper functions for optimizing this selection. Selectors provide many features when selecting slices of state"

- A Selector is a reusable query of our store
- Selectors allow us to keep one copy of state in the store
- The components use the selector to select state from the store

- A Selector is a function, that drills into the store and returns a specific bit of state.

## Types of selectors

There are two basic types of selector functions.

1. Create Feature Selector

```
const getProductFeatureState = createFeatureSelector<ProductState>('products')
```

This allows us to get the feature slice of state simply by specifiying it´s feature name. Strongly type the return value _ProductState_ using the generic argument. We specify our product slice of state and assign this function to a constant.

- When executed it selects the specific feature slice of state.

### Disadvantage

We don´t export the constant, so it can only be used where it is defined

ToDo: image feature slice of state

### Where to put the selectors in code

Inside the reducer

2. Create Selector

```
export const getShowProductCode = createSelector(
  getProductFeatureState,
  state => state.showProductCode
);
```

This functionm allows us to get any bit of state by composing selectors to navigate down the state tree.

We pass the Feature Selector Function _getProductFeatureState_ in as the first argument of the selector.

The last argument is a projector function, that takes in the sate returned from the prior arguments which in this case is the product slices we can then filter, map or otherwise process the state to return the desired value.

ToDo: Img Selector - Create Selector

- When executed it select a specific bit of state an returns its value
- If the store structure changes, we can modify these selectors to access that new structure without changing any of the components that use it.

### Without a selector

```
this.store.select('product').subscribe((products) => {
  this.displayCode = products.showProductCode
});
```

- _'products'_ are representing the slice of state. (Hard-coded string)
- The select returns the data in the store associated with this name.
- It returns the entire product slice of state, we than manaully navigate down from the products slice to the desire property, so we must know how to navigate the state tree to use a selector.

```
this.store.select(getShowProductCode).subscribe((showProductCode) => {
  this.displayCode = showProductCode
});
```

- We replace the Hard-coded string _products_ with a reference to the desired selector _getShowProductCode_.  
  This than returns the Boolean flag value _this.showProductCode_, so we simply assign that value to our local property _this.displayCode = showProductCode_.  
  This code knows nothing about our store structure.

## Problem with select an entire slice of state

```
// selecting the entire product slice of state
this.store.select('products').subscribe((products) => {
  this.displayCode = products.showProductCode;
});
```

- Hard-coded string: _'products'_
- Knows the store structure: Expicitly retrieve a property from the store _products.showProductCode_. If we ever change the structure of our store or re-organizing it into sub-slices, we have to update every .select.
- Watches for changes to any properties in the product slices of state, this code is notified even if the _showProductCode_ property was not changed.

The solution for this problems are selectors.

## Benefits of Selectors

- Provide a strongly typed API for the components to use
- Decouple the store from the components, so the components don´t need to know
  about the structure of the store, this allows as to re-organize or split up the state differently over time without updating every component that accesses it
- Reusable: Any component can access the same bit of state the same way

## Composing Selectors

```
const getProductFeatureState = createFeatureSelector<ProductState>('products');
```

```
export const getCurrentProductId = createSelector(
  getProductFeatureState,
  state => state.currentProductId
)
```

```
export const getCurrentProduct = createSelector(
  getProductFeatureState,
  getCurrentProductId,
  (state, currentProductId => {
    state.products.find(p => p.id === currentProductId)
  }
)
```

## Checklist: Strongly Typing State

- Define an interface for each slice of state
- Compose them for the global application state
- Use the interfaces to strongly type the state throuhout the application
- Always provide inital values for each slice of state
- Build selectors to define reusable state queries against the store
- Define a feature selector to return a feature slice of state
- Use the general selector (createSelector) to return any bit of state from the store by composing seletor functions to navigate down the state tree


# Effects

