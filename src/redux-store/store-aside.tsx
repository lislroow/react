import { createStore, combineReducers } from 'redux';

const SHOW = 'SHOW' as const;
const HIDE = 'HIDE' as const;

export const actAsideShow = () => ({
  type: SHOW,
  payload: true
});

export const actAsideHide = () => ({
  type: HIDE,
  payload: false
});

type Actions = 
  | ReturnType<typeof actAsideShow>
  | ReturnType<typeof actAsideHide>;

type State = {
  display: boolean
};

const initialState = {
  display: false
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case SHOW:
      return { 
        display: action.payload
      };
    case HIDE:
      return { 
        display: action.payload
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  aside: reducer
});

const storeAside = createStore(reducers);

// console.log('[TODO] createStore is deprecated');

export default storeAside;