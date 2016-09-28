import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/do';

import { ActionsObservable } from 'redux-observable';
import { UPDATE_LOCATION } from 'ng2-redux-router'; 

import { IPayloadAction, ListActions } from '../actions';
import { DataService } from '../services/data.service';
import { RouteParamsService } from '../services/route-params.service';

@Injectable()
export class ListEpics {
  constructor(
    private route: ActivatedRoute, 
    private dataService: DataService,
    private routeParamsService: RouteParamsService) {}

  saveAll = (action$: ActionsObservable<IPayloadAction>) => {
    return action$.ofType(ListActions.SAVE_ALL)
      .mergeMap((action) => {
        return this.dataService.saveObjections(action.payload.oldObjections, action.payload.newObjections)
          .map(result => {
            alert('Thank you! We have received your change suggestions ' 
            + 'and will review them for inclusion in the resource.');
            return {
              type: ListActions.STORE_OBJECTIONS,
              payload: { objections: result.json() }
            };
          })
          .catch(error => {
            console.log(error);
            return Observable.of({
              type: ListActions.FETCH_OBJECTIONS_ERROR
            });
          });
     });
  }

  getData = (action$: ActionsObservable<IPayloadAction>) => {
    return action$.ofType(ListActions.GET_DATA, UPDATE_LOCATION)
      .mergeMap((action) => {

        // combined subscription of route.params and dataService.getObjections()
        return Observable.zip(
          this.route.params,
          this.dataService.getObjections(),
          (params, objections) => {
//              console.log('route.params in list.epics.getData:::: ' + params['objectionId']);
               debugger;
              let objectionId: number = 3;//this.routeParamsService['objectionId'];
              let outActions: Array<any> = [];
              outActions.push( {
                type: ListActions.STORE_OBJECTIONS,
                payload: { objections: objections }
              });
              if (objectionId !== undefined) {
                outActions.push({
                  type: ListActions.SEEK_OBJECTION,
                  payload: { objectionId: objectionId }
                });
                outActions.push({
                  type: ListActions.EXPAND_OBJECTION,
                  payload: { objectionId: objectionId }
                });
              }
              return outActions;  // I don't think making it an Observable is necessary
            }
          )
          .catch(error => {
            console.log(error);
            return Observable.of({
              type: ListActions.FETCH_OBJECTIONS_ERROR
            });
          })
      .do(value => {
        debugger;
      })
          .switch(); // this is saying "what ever is emitted (in this case, the array of actions) switch to that value as stream itself
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
