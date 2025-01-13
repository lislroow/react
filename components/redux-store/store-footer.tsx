import { createStore, combineReducers } from 'redux';

const CLEAR = 'CLEAR' as const;
const DISPLAY = 'DISPLAY' as const;

export const actFooterClear = () => ({
  type: CLEAR,
  payload: ''
});

export const actFooterMessage = (message: string) => ({
  type: DISPLAY,
  payload: message
});

type Actions = 
  | ReturnType<typeof actFooterClear>
  | ReturnType<typeof actFooterMessage>;

type State = {
  message: string
};

const initialState = {
  message: ''
};

const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case CLEAR:
      return { message: '' };
    case DISPLAY:
      return { message: action.payload };
    default:
      return state;
  }
}

const reducers = combineReducers({
  footer: reducer
});

const storeFooter = createStore(reducers);

// console.log('[TODO] createStore is deprecated');

export default storeFooter;