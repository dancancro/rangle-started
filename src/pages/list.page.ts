import { ActivatedRoute } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ContentChildren } from '@angular/core';
import { Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { OnChanges } from '@angular/core';
import { QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';

import { NgRedux } from 'ng2-redux';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../services/data.service';
import { IObjection } from '../store';
import { IList } from '../store/list/list.types';
import { IListRecord } from '../store/list/list.types';
import { ListActions } from '../actions';
import { ListFactory } from '../store/list/list.initial-state';

@Component({
  selector: 'app-list',
  template: require('./list.page.html'),
  styles: [require('./list.page.css')],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService, ListActions]
})
export class ListPage implements OnInit, OnChanges {
  @select('list') private list$: Observable<IList>;
  @select(['list', 'objections']) private objections$: Observable<IObjection[]>;

  private subscription: any;
  options: SortablejsOptions = {
    disabled: false
  };

  constructor(
    private route: ActivatedRoute, 
    public listActions: ListActions,
    private dataService: DataService) {
  }

  ngOnChanges() {
    console.log('changes');
  }

  ngOnInit() {
    // TODO: Maybe this should happen in a new ngModule
    // this.subscription = this.dataService.getObjections().subscribe({
    //     next: (objections) => this.listActions.fetchObjections(objections),
    //     error: (err) => this.listActions.error(err)
    //  });
        this.route.params.subscribe(
          (params) => console.log('route.params in list.page:::: ' + params['objectionId'])
        );
    this.subscription = this.dataService.getObjections().subscribe({
        next: (objections) => this.listActions.storeObjections(objections),
        error: (err) => this.listActions.error(err)
      });
  }
}
