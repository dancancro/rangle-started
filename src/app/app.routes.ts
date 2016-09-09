import { Routes } from '@angular/router';
import {
  RioCounterPage,
  RioAboutPage,
  ListPage
} from '../pages';

export const APP_ROUTES: Routes = [{
  pathMatch: 'full',
  path: '',
  redirectTo: 'counter'
}, {
  path: 'counter',
  component: RioCounterPage
}, {
  path: 'about',
  component: RioAboutPage
}, { 
  path: 'list/:objectionId',
  component: ListPage
}, { 
  path: 'list', 
  component: ListPage 
}];
