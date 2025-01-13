import { createStore, combineReducers } from 'redux';

const TURN_ON = 'TURN_ON' as const;
const TURN_OFF = 'TURN_OFF' as const;

export const actTurnOn = (title: string, message: string) => ({
  type: TURN_ON,
  payload: true
});

export const actTurnOff = (title: string, message: string) => ({
  type: TURN_OFF,
  payload: true
});

type Actions = 
  | ReturnType<typeof actTurnOn>
  | ReturnType<typeof actTurnOff>;

type State = {
  sessionTimerOn: boolean
};

const initialState = {
  sessionTimerOn: false
};

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case TURN_ON:
      return { 
        sessionTimerOn: action.payload
      };
    case TURN_OFF:
      return { 
        sessionTimerOn: action.payload
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  sessionTimer: reducer
});

const storeSessionTimer = createStore(reducers);

console.log('[TODO] createStore is deprecated');

export default storeSessionTimer;