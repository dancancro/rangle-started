// Actions
import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { IAppState } from '../store';

@Injectable()
export class ListActions {
  // List actions
  static OBJECTIONS_FETCHED_OK = 'OBJECTIONS_FETCHED_OK';
  static OBJECTIONS_FETCHED_ERROR = 'OBJECTIONS_FETCHED_ERROR';
  static OBJECTION_ADDED = 'OBJECTION_ADDED';
  static OBJECTIONS_STORED = 'OBJECTIONS_STORED';
  static OBJECTIONS_REORDERED = 'OBJECTIONS_REORDERED';
  static ALL_EXPANDED = 'ALL_EXPANDED';
  static ALL_COLLAPSED = 'ALL_COLLAPSED';
  static EDITABLE_TOGGLED = 'EDITABLE_TOGGLED';
  static ALL_SAVED = 'ALL_SAVED';

  // Objection actions
  static REBUTTAL_ADDED = 'REBUTTAL_ADDED';
  static OBJECTION_STARRED = 'OBJECTION_STARRED';
  static OBJECTION_EXPANDED = 'OBJECTION_EXPANDED';
  static OBJECTION_COLLAPSED = 'OBJECTION_COLLAPSED';
  static REBUTTALS_REORDERED = 'REBUTTALS_REORDERED';

  // Rebuttal actions
  static REBUTTAL_CANCELED = 'REBUTTAL_CANCELED';
  static REBUTTAL_SAVED = 'REBUTTAL_SAVED';
  static REBUTTAL_MADE_EDITABLE = 'REBUTTAL_MADE_EDITABLE';

  constructor(private ngRedux: NgRedux<IAppState>) { }
  _oldObjections = [];  // TODO: This should probably go somewhere else

// List Actions

  storeObjections(objections): void {
    this._oldObjections = objections;
    this.ngRedux.dispatch({
      type: ListActions.OBJECTIONS_STORED,
      payload: {objections: objections}
    });
  }

  addObjection(): void {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTION_ADDED
    });
  }

  reorderObjections(): void {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTIONS_REORDERED
    });
  }

  expandAll() {
    this.ngRedux.dispatch({
      type: ListActions.ALL_EXPANDED
    });
  }

  collapseAll() {
    this.ngRedux.dispatch({
      type: ListActions.ALL_COLLAPSED
    });
  }

  toggleEditable() {
    this.ngRedux.dispatch({
      type: ListActions.EDITABLE_TOGGLED
    });
  }

  // saveAll({objections}) {
  //   objections.subscribe((obs) =>
  //   this.dataService.saveObjections(obs)
  //   .subscribe(() =>
  //     this.ngRedux.dispatch({
  //       type: ListActions.OBJECTIONS_FETCHED_OK,
  //       payload: { objections: obs }
  //     })
  //   )
  //   );
  // }

  // TODO: This currently compares the original objections set to the current one. 
  // If this supports observed additions that could be edited, then we'd want to
  // compare the changes with whatever was served to the page not just the original ones.
  saveAll() {
      this.ngRedux.dispatch({
        type: ListActions.ALL_SAVED,
        payload: {
          oldObjections: this._oldObjections,
          newObjections: this.ngRedux.getState().list.objections}
      });
  }

// Objection Actions

  addRebuttal({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.REBUTTAL_ADDED,
      payload: {
        objection: objection
      }
    });
  }

  starObjection({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTION_STARRED,
      payload: { objection: objection }
    });
  }

  toggleRebuttals({objection}) {
    if ( objection.expanded ) {
      this.collapseObjection(objection);
    } else {
      this.expandObjection(objection);
    }
  }

  reorderRebuttals({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.REBUTTALS_REORDERED,
      payload: { objection: objection }
    });
  }

  expandObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.OBJECTION_EXPANDED,
       payload: { objection: objection }
      });
  }

  collapseObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.OBJECTION_COLLAPSED,
       payload: { objection: objection }
      });
  }

  // Rebuttal Actions
  
  cancelRebuttal({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_CANCELED,
       payload: { rebuttal: rebuttal,
                  objection: objection }
    });
  }

  saveRebuttal({rebuttal, objection, newRebuttal}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_SAVED,
       payload: { rebuttal: rebuttal,
                  objection: objection,
                  newRebuttal: newRebuttal }
    });

  }

  makeRebuttalEditable({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_MADE_EDITABLE, 
      payload: { rebuttal: rebuttal,
                 objection: objection }
    });
  }

  goTo(id) {
    //  var y = document.getElementById(id)
    // .getBoundingClientRect().top - 
    // $('div .row')[0].getBoundingClientRect().bottom - 10;
    //  window.scrollBy(0,y);
    //  var span = $($('#' + id).parent('div')[0]).find('span')[0];
    //  toggleRebuttals(span);
  }

  error(err): void {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTIONS_FETCHED_ERROR,
      error: err
    });
  }
}
