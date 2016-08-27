// Actions
import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { IAppState } from '../store';
import { IObjection } from '../store';

@Injectable()
export class ListActions {
  static OBJECTIONS_FETCHED_OK = 'OBJECTIONS_FETCHED_OK';
  static OBJECTIONS_FETCHED_ERROR = 'OBJECTIONS_FETCHED_ERROR';
  static OBJECTION_ADDED = 'OBJECTION_ADDED';
  static OBJECTIONS_REORDERED = 'OBJECTIONS_REORDERED';
  static ALL_EXPANDED = 'ALL_EXPANDED';
  static ALL_COLLAPSED = 'ALL_COLLAPSED';
  static EDITABLE_TOGGLED = 'EDITABLE_TOGGLED';

  static REBUTTAL_ADDED = 'REBUTTAL_ADDED';
  static OBJECTION_STARRED = 'OBJECTION_STARRED';
  static OBJECTION_EXPANDED = 'OBJECTION_EXPANDED';
  static OBJECTION_COLLAPSED = 'OBJECTION_COLLAPSED';
  static REBUTTALS_REORDERED = 'REBUTTALS_REORDERED';

  static REBUTTAL_CANCELED = 'REBUTTAL_CANCELED';
  static REBUTTAL_SAVED = 'REBUTTAL_SAVED';
  static REBUTTAL_MADE_EDITABLE = 'REBUTTAL_MADE_EDITABLE';

  constructor(private ngRedux: NgRedux<IAppState>) { }

// List Actions

  fetchObjections(objections): void {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTIONS_FETCHED_OK,
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

// Objection Actions

  addRebuttal() {
    this.ngRedux.dispatch({
      type: ListActions.EDITABLE_TOGGLED
    });
  }

  starObjection({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.EDITABLE_TOGGLED,
      payload: { objectionId: objection.id }
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
      payload: { objectionId: objection.id }
    });
  }

  expandObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.OBJECTION_EXPANDED,
       payload: { objectionId: objection.id }
      });
  }

  collapseObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.OBJECTION_COLLAPSED,
       payload: { objectionId: objection.id }
      });
  }

  // Rebuttal Actions
  
  cancelRebuttal({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_CANCELED,
       payload: { rebuttalId: rebuttal.id }
    });
  }

  saveRebuttal({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_SAVED,
       payload: { rebuttalId: rebuttal.id }
    });

  }

  makeRebuttalEditable({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.REBUTTAL_MADE_EDITABLE, 
      payload: { rebuttalId: rebuttal.id,
                 objectionId: objection.id }
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

  saveAll() {
    //    this.dataxxService.saveObjections(this.store.objections);

    // this.objectionStore.objections.forEach(objection => {
    //   objection.reordered = false;
    //   objection.rebuttals.forEach(rebuttal =>
    //     rebuttal.touched = false);
    // });
  // this.touched = false;
  }
  
  error(err): void {
    this.ngRedux.dispatch({
      type: ListActions.OBJECTIONS_FETCHED_ERROR,
      error: err
    });
  }
}
