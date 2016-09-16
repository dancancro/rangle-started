import { combineReducers } from 'redux';
import { routerReducer } from 'ng2-redux-router';
import * as counter from './counter';
import * as session from './session';
import * as list from './list';
import { List } from 'immutable';


export interface IAppState {
  counter?: counter.ICounter;
  session?: session.ISession;
  list?: list.IList;
};

export const rootReducer = combineReducers<IAppState>({
  counter: counter.counterReducer,
  session: session.sessionReducer,
  router: routerReducer,
  list: list.listReducer,
});

export function deimmutify(store) {
  return {
    counter: store.counter.toJS(),
    session: store.session.toJS(),
    router: store.router,
    list: store.list.toJS(),
  };
}

// Get the data from local storage
export function reimmutify(plain) {
  return {
    counter: counter.CounterFactory(plain.counter),
    session: session.SessionFactory(plain.session),
    router: plain.router,
    list: list.ListFactory(plain.list)
      // .map(objection => list.ObjectionFactory(objection)
      //           .update('rebuttals', 
      //             (rebs) => List(rebs.map(
      //                             (reb) =>  list.RebuttalFactory(reb))
      //                           )
      //                   )
      //     )
  };
}
