import {NgModule}      from '@angular/core';
// import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import { DevToolsExtension, NgRedux } from 'ng2-redux';
import {NgReduxRouter} from 'ng2-redux-router';
import { routing, appRoutingProviders } from './app.routing';
import {FormBuilder} from '@angular/forms';
import {BernieApp} from './app';
import {SessionActions} from '../actions/session.actions';
import {SessionEpics} from '../epics/session.epics';
import { ListEpics } from '../epics/list.epics';
import { ListActions } from '../actions/list.actions';
import { RioAboutPage, RioCounterPage, ListPage } from '../pages';
import {RioCounter} from '../components/counter/counter.component';
// import { ObjectionComponent } from '../components/objection/objection.component';
// import { RebuttalComponent } from '../components/rebuttal/rebuttal.component';
import {RioLoginModule} from '../components/login/login.module';
import {RioUiModule} from '../components/ui/ui.module';
import {RioNavigatorModule} from '../components/navigator/navigator.module';
import { ListModule } from '../components/list/list.module';

@NgModule({
  imports: [
    BrowserModule,
    routing,
//    CommonModule,
    RioLoginModule,
    RioUiModule,
    RioNavigatorModule,
    ListModule
  ],
  declarations: [
    BernieApp,
    RioAboutPage,
    RioCounterPage,
//    ListPage,
    RioCounter
  ],
  bootstrap: [
    BernieApp
  ],
  providers: [
    DevToolsExtension,
    FormBuilder,
    NgRedux,
    NgReduxRouter,
    appRoutingProviders,
    SessionActions,
    SessionEpics,
    ListEpics
  ]
})
export class BernieAppModule { }
