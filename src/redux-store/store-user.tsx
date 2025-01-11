import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { UserInfo } from 'types/UserTypes';

const USER = 'USER' as const;

export const actUpdate = (user: UserInfo) => ({
  type: USER,
  payload: user,
});

type Actions = 
  | ReturnType<typeof actUpdate>;

const initialState: UserInfo = {
};

const reducer = (state: UserInfo = initialState, action: Actions): UserInfo => {
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