import { Action } from 'redux';
import { CounterActions } from './counter.actions';
import { SessionActions } from './session.actions';
import { ListActions } from './list.actions';

export interface IPayloadAction extends Action {
  payload?: any;

}

export const ACTION_PROVIDERS = [ CounterActions, SessionActions, ListActions ];
export { CounterActions, SessionActions, ListActions };
