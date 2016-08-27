// import Immutable = require('immutable');
import { List } from 'immutable';
import { Map } from 'immutable';
import { Record } from 'immutable';

import { IPayloadAction } from '../../actions';
import { ListActions } from '../../actions/list.actions';
import { IList } from './list.types';
import { IListRecord } from './list.types';
import { INITIAL_LIST_STATE } from './list.initial-state';
import { IObjection } from './list.types';
import { IObjectionRecord } from './list.types';
import { IRebuttal } from './list.types';
import { ListFactory } from './list.initial-state';
import { ObjectionFactory } from './list.initial-state';
import { RebuttalFactory } from './list.initial-state';

export function listReducer(state: IListRecord = INITIAL_LIST_STATE,
  action: IPayloadAction): IListRecord {
  switch (action.type) {

    // List actions

    case ListActions.OBJECTIONS_FETCHED_OK:
      let x = INITIAL_LIST_STATE.merge(
          {
            // Make an IObjection out of every POJO objection. Then replace each one's array of POJO rebuttals with a List of IRebuttals'
            objections: List([...action.payload.objections]
                              .map(objection => ObjectionFactory(objection).update('rebuttals', (rebuttals) => List(rebuttals.map((rebuttal) => RebuttalFactory(rebuttal))))))
          });
      return x;


    case ListActions.OBJECTION_ADDED:

    case ListActions.OBJECTIONS_REORDERED:

    case ListActions.ALL_EXPANDED:
      return expandAll(state, action, true);

    case ListActions.ALL_COLLAPSED:
      return expandAll(state, action, false);

    case ListActions.EDITABLE_TOGGLED:
      return updateListField(state, action, 'editable', !state.get('editable'));
      // this.editable = !this.editable;
      // this.options.disabled = !this.options.disabled;   // draggabilitty

    // Objection actions

    case ListActions.REBUTTAL_ADDED:
      return state;
      
    case ListActions.OBJECTION_STARRED:
      return updateOneObjection(state, action, 'star', true);

    case ListActions.OBJECTION_EXPANDED:
      return updateOneObjection(state, action, 'expanded', true);

    case ListActions.OBJECTION_COLLAPSED:
      return updateOneObjection(state, action, 'expanded', false);

    case ListActions.REBUTTALS_REORDERED:
      return updateOneObjection(state, action, 'rebuttalsReordered', true);

    // Rebuttal actions

    case ListActions.REBUTTAL_CANCELED:
      return state;
  //   if ( this.rebuttal.id === 0 ) {
  //     this.onCancel.emit(null);
  //     return;
  //   }
  //     this.rebuttal.shortName = this.oldShortName;
  //     this.rebuttal.longName = this.oldLongName;
  //     this.rebuttal.link = this.oldLink;
  //     this.rebuttal.comments = this.oldComments;
  //     this.toggleEditing(); 
  // }

    case ListActions.REBUTTAL_SAVED:
    // this.rebuttal.touched = 
    //   this.rebuttal.shortName !== this.oldShortName ||
    //   this.rebuttal.longName !== this.oldLongName ||
    //   this.rebuttal.link !== this.oldLink ||
    //   this.rebuttal.comments !== this.oldComments;
    
    // this.toggleEditing(); 
    // if (this.rebuttal.touched) {
    //   this.edit.emit(null);
    // }
    case ListActions.REBUTTAL_MADE_EDITABLE:
      return updateRebuttalField(state, action.payload.rebuttalId, 
        action.payload.objectionId, 'editing', true);
      
    default:
      return state;
  }
}

function findObjectionIndex(objections: List<IObjection>, id): number {
  return objections.findIndex((objection) => objection.id === id);
}

function findRebuttalIndex(rebuttals: List<IRebuttal>, id): number {
  return rebuttals.findIndex((rebuttal) => rebuttal.id === id);
}

function updateOneObjection(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
  let index = findObjectionIndex((<IListRecord>state).get('objections'), action.payload.objectionId);
  return (<IListRecord>state).update('objections', 
          (objections: List<IObjectionRecord>) =>
             objections.update(
               index, (objection: IObjectionRecord) => 
                 objection.update(fieldName, () => value)
               )
        );
}

function updateAllObjections(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
  let _state = state;
  state.get('objections').forEach(objection => {
      action = Object.assign({}, action, {payload: {objectionId: objection.id}});
      _state = updateOneObjection(_state, action, fieldName, value);
    }
  );
  return _state;
}

function expandAll(state: IListRecord, action: IPayloadAction, expand: boolean) {
  let _state = updateAllObjections(state, action, 'expanded', expand);
  return updateListField(_state, action, 'expanded', expand);
}

function updateListField(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
    return state.update(fieldName, () => value );
}

function updateRebuttalField(state: IListRecord, rebuttalId: number, objectionId: number, fieldName: string, value: any): IListRecord {
  let objectionIndex = findObjectionIndex((<IListRecord>state).get('objections'), objectionId);
  let rebuttals = (<IListRecord>state).getIn(['objections', objectionIndex, 'rebuttals']);
  let rebuttalIndex = findRebuttalIndex(rebuttals, rebuttalId);
    return state.updateIn([
                            'objections',
                            objectionIndex, 
                            'rebuttals', 
                            rebuttalIndex, 
                            fieldName], 
                            () => value);
}
