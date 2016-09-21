// import Immutable = require('immutable');
import { List } from 'immutable';
import { Map } from 'immutable';
import { Record } from 'immutable';
import { UPDATE_LOCATION } from 'ng2-redux-router';

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
import { NewRebuttalFactory } from './list.initial-state';

export function listReducer(state: IListRecord = INITIAL_LIST_STATE,
  action: IPayloadAction): IListRecord {
  
console.log('in the reducer ' + action.type);

  // TODO: make the functions pure
  // is it bad to have member state variables in an action creator? does that make the functions not pure?
  // if i don't do this then these lookups will have to go in several functions'
  let objections = (<IListRecord>state).get('objections');

 // console.log('[action: ' + action.type + '] [objection: ' + typeof objections + '] [getIn:  ' + typeof objections.getIn + ']' );

  let objection = action.payload 
        ? action.payload.objection 
        : undefined;
  let objectionId = action.payload 
        ? action.payload.objectionId
        : undefined;
  if (objectionId) {
    objection = objections.find(o => o.id === objectionId);
  } else if (objection) {
    objectionId = action.payload.objection.id;
  }
  let objectionIndex = objectionId 
        ? findObjectionIndex(objections, objectionId) 
        : undefined;
  let rebuttals = objection
        ? objection.rebuttals
        : undefined;
  let rebuttalIndex = rebuttals && action.payload.rebuttal 
        ? findRebuttalIndex(rebuttals, action.payload.rebuttal.id) 
        : undefined;
  let rebuttal = action.payload 
        ? action.payload.rebuttal 
        : undefined;

  switch (action.type) {

    // List actions
    case UPDATE_LOCATION:
       return state;

    case ListActions.STORE_OBJECTIONS:
      return state.merge(
          {
            // Make an IObjection out of every POJO objection. Then replace each one's array of POJO rebuttals with a List of IRebuttals'
            // objections: List([...action.payload.objections]
            //                   .map(o => ObjectionFactory(o).update('rebuttals', (rebs) => List(rebs.map((reb) => 
            //                     RebuttalFactory(reb))))))
            objections: List([...action.payload.objections]
                              .map(o => ObjectionFactory(o)))
          });

    case ListActions.ADD_OBJECTION:
      return state.update('objections', (obs) => obs.push(ObjectionFactory()));

    case ListActions.REORDER_OBJECTIONS:
      return state;

    case ListActions.EXPAND_ALL:
      return expandAll(state, objections, action, true);

    case ListActions.COLLAPSE_ALL:
      return expandAll(state, objections, action, false);

    case ListActions.TOGGLE_EDITABLE:
      return updateListField(state, action, 'editable', !state.get('editable'));
      // this.options.disabled = !this.options.disabled;   // draggabilitty

    case ListActions.SAVE_ALL:
     // TODO
     return state;

     case ListActions.SEEK_OBJECTION:
        let y = document.getElementById(objectionId).getBoundingClientRect().top - 80;
        updateListField(state, action, 'scrollY', y);
        window.scrollBy(0, y);  // is this in the right place? is it a side-effect?
       return state;
      
    // Objection actions

    case ListActions.ADD_REBUTTAL:
      return state.updateIn(['objections', objectionIndex, 'rebuttals'],   
                             (rebs: List<IRebuttal>) => rebs.push(NewRebuttalFactory()));
      
    case ListActions.STAR_OBJECTION:
      return updateOneObjection(state, objectionIndex, 'star', true);

    case ListActions.EXPAND_OBJECTION:
      return updateOneObjection(state, objectionIndex, 'expanded', true);

    case ListActions.COLLAPSE_OBJECTION:
      return updateOneObjection(state, objectionIndex, 'expanded', false);

    case ListActions.REORDER_REBUTTALS:
      return updateOneObjection(state, objectionIndex, 'rebuttalsReordered', true);

    // Rebuttal actions

    case ListActions.CANCEL_REBUTTAL:
      if ( rebuttal.id ) {
        return updateRebuttalField(state, rebuttalIndex, objectionIndex, 'editing', false);
      }
      return state.updateIn(['objections', objectionIndex, 'rebuttals'], () => rebuttals.delete(rebuttalIndex));

    case ListActions.SAVE_REBUTTAL:
      return state.updateIn(['objections', objectionIndex, 'rebuttals', rebuttalIndex], () => RebuttalFactory().merge({
        id: action.payload.rebuttal.id,
        shortName: action.payload.newRebuttal.shortName.value, 
        longName: action.payload.newRebuttal.longName.value,
        link: action.payload.newRebuttal.link.value,
        comments: action.payload.newRebuttal.comments.value,
        original: rebuttal.original || rebuttal })
      );
    
    case ListActions.MAKE_REBUTTAL_EDITABLE:
      return updateRebuttalField(state, rebuttalIndex, objectionIndex, 'editing', true);
      
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

function expandAll(state: IListRecord, objections: List<IObjection>, action: IPayloadAction, expand: boolean) {
  let _state = updateAllObjections(state, action, objections, 'expanded', expand);
  return updateListField(_state, action, 'expanded', expand);
}

function updateOneObjection(state: IListRecord, objectionIndex: number, fieldName: string, value: any): IListRecord {
  return (<IListRecord>state).updateIn(['objections', objectionIndex, fieldName], () => value);
}

function updateAllObjections(state: IListRecord, action: IPayloadAction, objections: List<IObjection>, fieldName: string, value: any): IListRecord {
  let _state = state;
  state.get('objections').forEach(objection => {
      let objectionIndex = findObjectionIndex(objections, objection.id);
      action = Object.assign({}, action, {payload: {objection: objection}});
      _state = updateOneObjection(_state, objectionIndex, fieldName, value);
    }
  );
  return _state;
}

function updateListField(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
    return state.update(fieldName, () => value );
}

function updateRebuttalField(state: IListRecord, rebuttalIndex: number, objectionIndex: number, fieldName: string, value: any): IListRecord {
    return state.updateIn([
                            'objections',
                            objectionIndex, 
                            'rebuttals', 
                            rebuttalIndex, 
                            fieldName], 
                            () => value);
}
