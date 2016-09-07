import { ActivatedRoute } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ContentChildren } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import { QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Params } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';

import { NgRedux } from 'ng2-redux';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/forkJoin';

import { DataService } from '../services/data.service';
import { IObjection } from '../store';
import { IList } from '../store/list/list.types';
import { IListRecord } from '../store/list/list.types';
import { ListActions } from '../actions';
import { ListFactory } from '../store/list/list.initial-state';

import {
  Connect,
  ConnectArray,
  FormStore,
  NgReduxForms,
  composeReducers,
  defaultFormReducer,
} from 'ng2-redux-form';

@Component({
  moduleId: module.id,
  selector: 'app-list',
  template: require('./list.page.html'),
  styles: [require('./list.page.css')],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService, ListActions]
})
export class ListPage implements OnInit, AfterViewChecked {
  @select('list') private list$: Observable<IList>;
  @select(['list', 'objections']) private objection$: Observable<IObjection[]>;
  _objectionId: string;  // this is only used once on load when seeking a specific objection

  private subscription: any;
  options: SortablejsOptions = {
    disabled: false
  };

  constructor(
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    public listActions: ListActions,
    private dataService: DataService) {
    }

  ngOnInit() {
    // TODO: Maybe this should happen in a new ngModule
    // let a$ :Observable<Params> = this.route.params.map(params => params['objection']);
    // let b$ :Observable<IObjection[]> = this.dataService.getObjections().map(objections => objections);
    
    Observable.forkJoin(
      this.route.params.map(params => params['objection']),
      this.dataService.getObjections().map(objections => objections)).subscribe(
        (res: Array<any>) => {
           let objectionId = res[0];
           let objections = res[1];
           this.listActions.fetchObjections(res[1]);
           let objection = objections.find(o => o.id === +this._objectionId);
           let y = document.getElementById(objectionId).getBoundingClientRect().top - 100;
           window.scrollBy(0, y);
           this.listActions.toggleRebuttals({objection: objection});
        },
        (err) => {
          this.listActions.error(err);
        },
        () => console.log('done')
      );

  }

  ngAfterViewChecked() { // to scroll after views are all rendered

    // http://www.w3schools.com/html/html5_webstorage.asp
    // if (window && window.sessionStorage) {
    //   let scrollTop = window.sessionStorage.getItem('lastScrollTop');
    //   if (scrollTop !== null) {
    //     scrollTop *= 1; // convert to number
    //     // console.log(scrollTop);
    //     this.elementRef.nativeElement.scrollTop = scrollTop;
    //   }
    // }
  }

}
