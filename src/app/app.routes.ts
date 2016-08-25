import {RouterConfig} from '@angular/router';
import {
  RioCounterPage,
  RioAboutPage,
  ListPage
} from '../pages';

export const APP_ROUTES: RouterConfig = [{
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
  path: 'list', 
  component: ListPage 
}];
