import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import { IPayloadAction, ListActions } from '../actions';
import { DataService } from '../services/data.service';

@Injectable()
export class ListEpics {
  constructor(private dataService: DataService) {}

  saveAll = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ListActions.ALL_SAVED)
      .mergeMap(({ payload }) => {
        return this.dataService.saveObjections(payload.oldObjections, payload.newObjections)
          .map(result => {
  //          debugger;
            alert('Thank you! We have received your change suggestions ' 
            + 'and will review them for inclusion in the resource.');
            return {
              type: ListActions.OBJECTIONS_STORED,
              payload: { objections: result.json() }
            };
          })
          .catch(error => {
            console.log(error);
            return Observable.of({
              type: ListActions.OBJECTIONS_FETCHED_ERROR
            });
          });
     });
  }
}

// console.log('Same instance?', this.myService === injector.get(MyService));
// import { ActionsObservable } from 'redux-observable';
// import { MiddlewareAPI } from 'redux';
// this.subscription = this.dataService.getObjections().subscribe({
//     next: (objections) => this.listActions.fetchObjections(objections),
//     error: (err) => this.listActions.error(err)
//   });
