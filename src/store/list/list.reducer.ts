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
      return INITIAL_LIST_STATE.merge(
          {
            // Make an IObjection out of every POJO objection. Then replace each one's array of POJO rebuttals with a List of IRebuttals'
            objections: List([...action.payload.objections]
                              .map(objection => ObjectionFactory(objection).update('rebuttals', (rebuttals) => List(rebuttals.map((rebuttal) => RebuttalFactory(rebuttal))))))
          });

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
      return updateRebuttalField(state, action.payload.rebuttal.id, action.payload.objection.id, 'editing', false);

    case ListActions.REBUTTAL_SAVED:
      let objectionIndex = findObjectionIndex((<IListRecord>state).get('objections'), action.payload.objection.id);
      let rebuttals = (<IListRecord>state).getIn(['objections', objectionIndex, 'rebuttals']);
      let rebuttalIndex = findRebuttalIndex(rebuttals, action.payload.rebuttal.id);
      let rebuttal = action.payload.rebuttal;
      let newRebuttal = action.payload.newRebuttal;
      let touched = 
        newRebuttal.shortName.value !== rebuttal.shortName ||
        newRebuttal.longName.value !== rebuttal.longName ||
        newRebuttal.link.value !== rebuttal.link ||
        newRebuttal.comments.value !== rebuttal.comments;
      return state.updateIn(['objections', objectionIndex, 'rebuttals', rebuttalIndex], () => RebuttalFactory({
        id: action.payload.rebuttal.id,
        shortName: action.payload.newRebuttal.shortName.value, 
        longName: action.payload.newRebuttal.longName.value,
        link: action.payload.newRebuttal.link.value,
        comments: action.payload.newRebuttal.comments.value,
        touched: touched,
        editing: false})
      );
    
    case ListActions.REBUTTAL_MADE_EDITABLE:
      return updateRebuttalField(state, action.payload.rebuttal.id, 
        action.payload.objection.id, 'editing', true);
      
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
  let index = findObjectionIndex((<IListRecord>state).get('objections'), action.payload.objection.id);
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
      action = Object.assign({}, action, {payload: {objection: objection}});
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
