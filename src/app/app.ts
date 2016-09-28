import { Component, ViewEncapsulation } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
import { NgReduxRouter } from 'ng2-redux-router';
import { createEpicMiddleware } from 'redux-observable';
import { combineEpics } from 'redux-observable';

import { IAppState, ISession, rootReducer } from '../store';
import { SessionActions } from '../actions/session.actions';
import { SessionEpics } from '../epics/session.epics';
import { ListEpics } from '../epics/list.epics';
import { RioAboutPage, RioCounterPage } from '../pages';
import { middleware, enhancers, reimmutify } from '../store';
import { ListFactory } from '../store/list';

import {
  RioButton,
  RioNavigator,
  RioNavigatorItem,
  RioLogo,
  RioLoginModal
} from '../components';

@Component({
  selector: 'bernie-app',
  // Allow app to define global styles.
  encapsulation: ViewEncapsulation.None,
  styles: [ require('../styles/index.css') ],
  template: require('./app.html')
})
export class BernieApp {
  @select(['session', 'hasError']) hasError$: Observable<boolean>;
  @select(['session', 'isLoading']) isLoading$: Observable<boolean>;
  @select(['session', 'user', 'firstName']) firstName$: Observable<string>;
  @select(['session', 'user', 'lastName']) lastName$: Observable<string>;
  @select(s => !!s.session.token) loggedIn$: Observable<boolean>;
  @select(s => !s.session.token) loggedOut$: Observable<boolean>;

  constructor(
    private devTools: DevToolsExtension,
    private ngRedux: NgRedux<IAppState>,
    private ngReduxRouter: NgReduxRouter,
    private actions: SessionActions,
    private sessionEpics: SessionEpics,
    private listEpics: ListEpics) {

    const enh = (__DEV__ && devTools.isEnabled()) ?
//      [ ... enhancers, devTools.enhancer({  // disabling local storage
      [ devTools.enhancer({
        deserializeState: reimmutify,
      }) ] :
      enhancers;

// I don't know how to get this to work so I put a call to it in the action. 
// That is more explicit, I think too which I've heard recommended.
    middleware.push(createEpicMiddleware(
                      combineEpics(this.sessionEpics.login, 
                                    this.listEpics.saveAll,
                                    this.listEpics.getData
                                   )
                                   ));

    ngRedux.configureStore(rootReducer, {}, middleware, enhancers);
    ngReduxRouter.initialize();
  }
};
