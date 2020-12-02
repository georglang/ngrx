# ngrx
Learning ngrx https://ngrx.io/

## Actions
Actions express unique events that happen throughout your application.   
```
interface Action {
  type: string;
}

```
The value of the type comes in the form of [Source] Event and is used to provide a context of what category of action it is, and where an action was dispatched from.

## Reducers 
State changes are handled by pure functions called reducers.   
They take the current state and the latest action to compute a new state.   

