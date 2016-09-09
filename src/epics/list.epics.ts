import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/ofType';

import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { UPDATE_LOCATION } from 'ng2-redux-router';

import { IPayloadAction, ListActions } from '../actions';
import { DataService } from '../services/data.service';

@Injectable()
export class ListEpics {
  constructor(
    private route: ActivatedRoute, 
    private dataService: DataService) {}

  saveData = (action$: ActionsObservable) => {
    return action$.ofType(ListActions.DATA_SAVED)
      .mergeMap(({ payload }) => {
        return this.dataService.saveObjections(payload.oldObjections, payload.newObjections)
          .map(result => {
            alert('Thank you! We have received your change suggestions ' 
            + 'and will review them for inclusion in the resource.');
            return {
              type: ListActions.OBJECTIONS_FETCHED_OK,
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

  getData = (action$: ActionsObservable) => {
    return action$.ofType(ListActions.DATA_SAVED, UPDATE_LOCATION)
      .mergeMap(({ payload }) => {
        return Observable.zip(
          this.route.params,
          this.dataService.getObjections())
          .mergeMap(
            (res: Array<any>) => {
              let objectionId: number = +res[0].objectionId;
              let objections: Array<any> = res[1];
              let outActions: Array<any> = [];
              outActions.push( {
                type: ListActions.OBJECTIONS_FETCHED_OK,
                payload: { objections: objections }
              });
              if (objectionId) {
                outActions.push({
                  type: ListActions.SEEK_OBJECTION,
                  payload: { objectionId: objectionId }
                });
                outActions.push({
                  type: ListActions.OBJECTION_EXPANDED,
                  payload: { objection: objectionId }
                });
              }
              return outActions;
            }
          )       
          .catch(error => {
            console.log(error);
            return Observable.of({
              type: ListActions.OBJECTIONS_FETCHED_ERROR
            });
          });
        }
      );
  }

}

// console.log('Same instance?', this.myService === injector.get(MyService));
// import { ActionsObservable } from 'redux-observable';
// import { MiddlewareAPI } from 'redux';
// this.subscription = this.dataService.getObjections().subscribe({
//     next: (objections) => this.listActions.fetchObjections(objections),
//     error: (err) => this.listActions.error(err)
//   });
