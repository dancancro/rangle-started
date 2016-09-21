// Actions
import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';
import { UPDATE_LOCATION } from 'ng2-redux-router';
import { Router } from '@angular/router';

import { IAppState } from '../store';
import { DataService } from '../services/data.service';

@Injectable()
export class ListActions {
  // List actions
//  static OBJECTIONS_FETCHED_OK = 'OBJECTIONS_FETCHED_OK';
  static FETCH_OBJECTIONS_ERROR = 'FETCH_OBJECTIONS_ERROR';
  static ADD_OBJECTION = 'ADD_OBJECTION';
  static STORE_OBJECTIONS = 'STORE_OBJECTIONS';
  static REORDER_OBJECTIONS = 'REORDER_OBJECTIONS';
  static EXPAND_ALL = 'EXPAND_ALL';
  static COLLAPSE_ALL = 'COLLAPSE_ALL';
  static TOGGLE_EDITABLE = 'TOGGLE_EDITABLE';
  static SAVE_ALL = 'SAVE_ALL';
  static GET_DATA = 'GET_DATA';
  static SEEK_OBJECTION = 'SEEK_OBJECTION';

  // Objection actions
  static ADD_REBUTTAL = 'ADD_REBUTTAL';
  static STAR_OBJECTION = 'STAR_OBJECTION';
  static EXPAND_OBJECTION = 'EXPAND_OBJECTION';
  static COLLAPSE_OBJECTION = 'COLLAPSE_OBJECTION';
  static REORDER_REBUTTALS = 'REORDER_REBUTTALS';

  // Rebuttal actions
  static CANCEL_REBUTTAL = 'CANCEL_REBUTTAL';
  static SAVE_REBUTTAL = 'SAVE_REBUTTAL';
  static MAKE_REBUTTAL_EDITABLE = 'MAKE_REBUTTAL_EDITABLE';

  constructor(private ngRedux: NgRedux<IAppState>) { }
  _oldObjections = [];  // TODO: This should probably go somewhere else

// List Actions

  storeObjections(objections): void {
    this._oldObjections = objections;
    this.ngRedux.dispatch({
      type: ListActions.STORE_OBJECTIONS,
      payload: {objections: objections}
    });
  }

  addObjection(): void {
    this.ngRedux.dispatch({
      type: ListActions.ADD_OBJECTION
    });
  }

  reorderObjections(): void {
    this.ngRedux.dispatch({
      type: ListActions.REORDER_OBJECTIONS
    });
  }

  expandAll() {
    this.ngRedux.dispatch({
      type: ListActions.EXPAND_ALL
    });
  }

  collapseAll() {
    this.ngRedux.dispatch({
      type: ListActions.COLLAPSE_ALL
    });
  }

  toggleEditable() {
    this.ngRedux.dispatch({
      type: ListActions.TOGGLE_EDITABLE
    });
  }

  updateLocation() {
     this.ngRedux.dispatch({
      type: UPDATE_LOCATION
    });
 }

  // TODO: This currently compares the original objections set to the current one. 
  // If this supports observed additions that could be edited, then we'd want to
  // compare the changes with whatever was served to the page not just the original ones.
  saveAll() {
      this.ngRedux.dispatch({
        type: ListActions.SAVE_ALL,
        payload: {
          oldObjections: this._oldObjections,
          newObjections: this.ngRedux.getState().list.objections}
      });
  }

// Objection Actions

  addRebuttal({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.ADD_REBUTTAL,
      payload: {
        objection: objection
      }
    });
  }

  starObjection({objection}) {
    this.ngRedux.dispatch({
      type: ListActions.STAR_OBJECTION,
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
      type: ListActions.REORDER_REBUTTALS,
      payload: { objection: objection }
    });
  }

  expandObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.EXPAND_OBJECTION,
       payload: { objection: objection }
      });
  }

  collapseObjection(objection): void {
    this.ngRedux.dispatch(
      { 
       type: ListActions.COLLAPSE_OBJECTION,
       payload: { objection: objection }
      });
  }

  // Rebuttal Actions
  
  cancelRebuttal({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.CANCEL_REBUTTAL,
       payload: { rebuttal: rebuttal,
                  objection: objection }
    });
  }

  saveRebuttal({rebuttal, objection, newRebuttal}) {
    this.ngRedux.dispatch({ 
      type: ListActions.SAVE_REBUTTAL,
       payload: { rebuttal: rebuttal,
                  objection: objection,
                  newRebuttal: newRebuttal }
    });

  }

  makeRebuttalEditable({rebuttal, objection}) {
    this.ngRedux.dispatch({ 
      type: ListActions.MAKE_REBUTTAL_EDITABLE, 
      payload: { rebuttal: rebuttal,
                 objection: objection }
    });
  }

  error(err): void {
    this.ngRedux.dispatch({
      type: ListActions.FETCH_OBJECTIONS_ERROR,
      error: err
    });
  }
}
