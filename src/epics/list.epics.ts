import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IPayloadAction, ListActions } from '../actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

const BASE_URL = '/api';

@Injectable()
export class ListEpics {
  constructor(private http: Http) {}

  saveAll = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ListActions.ALL_SAVED)
      .mergeMap(({ payload }) => {
        return this.http.post(`${BASE_URL}/list`, payload)
          .map(result => ({
            type: ListActions.OBJECTIONS_FETCHED_OK,
            payload: result.json()
          }))
          .catch(error => {
            return Observable.of({
              type: ListActions.OBJECTIONS_FETCHED_ERROR           });
          });
     });
  }
}

// console.log('Same instance?', this.myService === injector.get(MyService));
// import { ActionsObservable } from 'redux-observable';
// import { MiddlewareAPI } from 'redux';
