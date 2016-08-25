import { IAppState, rootReducer, deimmutify, reimmutify } from './store';
import { ICounter } from './counter';
import { ISession } from './session';
import { IObjection, IRebuttal, IList } from './list';

const createLogger = require('redux-logger');
const persistState = require('redux-localstorage');

export {
  IAppState,
  ISession,
  IObjection,
  IRebuttal,
  IList,
  ICounter,
  rootReducer,
  reimmutify,
};

export let middleware = [];
export let enhancers = [
  persistState(
    '',
    {
      key: 'bernie-app',
      serialize: store => JSON.stringify(deimmutify(store)),
      deserialize: state => reimmutify(JSON.parse(state)),
    })
];

if (__DEV__) {
  middleware.push(
    createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify,
  }));

  const environment: any = window || this;
  if (environment.devToolsExtension) {
    enhancers.push(environment.devToolsExtension());
  }
}
