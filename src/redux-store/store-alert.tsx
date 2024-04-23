import { createStore } from 'redux';
import { combineReducers } from 'redux';

const SHOW = 'SHOW' as const;

export const actAlertShow = (title: string, message: string) => ({
  type: SHOW,
  payload: {
    display: true,
    title: title,
    message: message
  }
});

type Actions = 
  | ReturnType<typeof actAlertShow>;

type State = {
  display: boolean,
  title?: string,
  message?: string
};

const initialState = {
  display: false,
  message: ''
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case SHOW:
      return { 
        display: action.payload.display, 
        title: action.payload.title,
        message: action.payload.message
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  alert: reducer
});

const storeAlert = createStore(reducers);

// console.log('[TODO] createStore is deprecated');

export default storeAlert;