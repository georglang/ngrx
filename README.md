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

### What Should Not Go In The Store

- Unshared state, state that is only owned by a single component and have not to be shared between multiple components
- Angular form state
- Non serializable state e.g the router state

## Actions

All relevant user events are dispatched as actions.  
Actions are events that have a type property, describing the action and can have optional data associating with them

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

## Reducer

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

## Advantages Of The Redux Pattern

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
*productList and productData* are smaller slices

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
