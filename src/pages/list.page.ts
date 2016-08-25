import { Component, Inject, ApplicationRef, OnInit, ContentChildren, 
         QueryList, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { SortablejsOptions } from 'angular-sortablejs';
// import { SortablejsOptions, SORTABLEJS_DIRECTIVES } from 'angular-sortablejs';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import { ObjectionComponent } from '../components/objection/objection.component';
import { DataService } from '../services/data.service';

import { ListActions } from '../actions';
import { IList, IObjection } from '../store';
import { IAppState } from '../store';
import { ListModule } from '../components/list/list.module';

@Component({
  moduleId: module.id,
  selector: 'app-list',
  template: require('./list.page.html'),
  styles: [require('./list.page.css')],
  changeDetection: ChangeDetectionStrategy.OnPush,
 // pipes: [AsyncPipe],
  providers: [DataService, ListActions]
})
export class ListPage implements OnInit {
  @select(['list', 'objections']) objection$: Observable<IObjection[]>;
// @select(['list', 'editable']) editable: boolean;

// this doesn't behave as expected'
//  @select(['list', 'expanded']) expanded: boolean; 
  @select(['list']) list: IList;

  private subscription: any;
  options: SortablejsOptions = {
    disabled: false
  };

  constructor(
    public listActions: ListActions,
    private dataService: DataService) {
  }

  ngOnInit() {
    this.subscription = this.dataService.getObjections().subscribe({
        next: (objections) => this.listActions.fetchObjections(objections),
        error: (err) => this.listActions.error(err)
      });
  }
}
