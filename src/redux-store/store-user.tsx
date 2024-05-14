import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { TypeUser } from 'types/TypeUser';

const USER = 'USER' as const;

export const actUpdate = (user: TypeUser) => ({
  type: USER,
  payload: user,
});

type Actions = 
  | ReturnType<typeof actUpdate>;

const initialState: TypeUser = {
};

const reducer = (state: TypeUser = initialState, action: Actions): TypeUser => {
  switch (action.type) {
    case USER:
      return action.payload;
    default:
      return state;
  }
}

const reducers = combineReducers({
  user: reducer
});

const storeUser = createStore(reducers);

// console.log('[TODO] createStore is deprecated');

export default storeUser;