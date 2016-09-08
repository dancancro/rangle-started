import { ActivatedRoute } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ContentChildren } from '@angular/core';
import { Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';

import { NgRedux } from 'ng2-redux';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';

import { DataService } from '../services/data.service';
import { IObjection } from '../store';
import { IList } from '../store/list/list.types';
import { IListRecord } from '../store/list/list.types';
import { ListActions } from '../actions';
import { ListFactory } from '../store/list/list.initial-state';

@Component({
  moduleId: module.id,
  selector: 'app-list',
  template: require('./list.page.html'),
  styles: [require('./list.page.css')],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService, ListActions]
})
export class ListPage implements OnInit {
  @select('list') private list: Observable<IList>;
  @select(['list', 'objections']) private objections: Observable<IObjection[]>;

  private subscription: any;
  options: SortablejsOptions = {
    disabled: false
  };

  constructor(
    private route: ActivatedRoute,
    public listActions: ListActions,
    private dataService: DataService) {
  }

  ngOnInit() {
    // TODO: Maybe this should happen in a new ngModule
    // this.subscription = this.dataService.getObjections().subscribe({
    //     next: (objections) => this.listActions.fetchObjections(objections),
    //     error: (err) => this.listActions.error(err)
    //   });


    Observable.forkJoin(
      this.route.params.map(params => params['objection']),
      this.dataService.getObjections().map(objections => objections)).subscribe(
        (res: Array<any>) => {
//          debugger;
          let objections = res[1];
          this.listActions.fetchObjections(objections);
          let objectionId = res[0];
          if (objectionId) {
            this.listActions.fetchObjections(res[1]);
            let objection = objections.find(o => o.id === +objectionId);
            let y = document.getElementById(objectionId).getBoundingClientRect().top - 100;
            window.scrollBy(0, y);
            this.listActions.toggleRebuttals({objection: objection});
          }
        },
        (err) => {
//          debugger;
          this.listActions.error(err);
        },
        () => {
//          debugger;
          console.log('done');
        }
      );


  }
}
