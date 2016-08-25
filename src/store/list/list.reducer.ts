// import Immutable = require('immutable');
import { List, Map } from 'immutable';
import { IPayloadAction } from '../../actions';
import { ListActions } from '../../actions/list.actions';
import { IObjection, IObjectionRecord, IList, IListRecord } from './list.types';
import { INITIAL_STATE } from './list.initial-state';

export function listReducer(state: IListRecord = INITIAL_STATE,
  action: IPayloadAction): IListRecord {
  switch (action.type) {

    // List actions

    case ListActions.OBJECTIONS_FETCHED_OK:
      return (<IListRecord>state).merge(
          {
            objections: List([...action.payload]
                              .map(objection => Map(objection))),
            editable: false,
          }
      );

    case ListActions.OBJECTION_ADDED:

    case ListActions.OBJECTIONS_REORDERED:

    case ListActions.ALL_EXPANDED:
      return expandAll(state, action, true);

    case ListActions.ALL_COLLAPSED:
      return expandAll(state, action, false);

    case ListActions.EDITABLE_TOGGLED:

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
      return updateRebuttalField(state, action.payload.objectionId, 
        action.payload.rebuttalId, 'editable', true);
      
    case ListActions.EDITABLE_TOGGLED:
      return updateListField(state, action, 'editable', state.get('editable'));
      // this.editable = !this.editable;
      // this.options.disabled = !this.options.disabled;   // draggabilitty
    default:
      return state;
  }
}

function findIndexById(objections: List<IObjection>, action): number {
  return objections.findIndex((objection) => objection.id === action.id);
}

function updateOneObjection(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
  let index = findIndexById((<IListRecord>state).get('objections'), action);
  return (<IListRecord>state).update('objections', 
          (objections: List<IObjectionRecord>) =>
             objections.update(
               index, (objection: IObjectionRecord) => {
                 console.log('type: ' + typeof objection + ' content: ' + JSON.stringify(objection));
                 return objection.update(fieldName, () => value);
               })
        );
}

function updateAllObjections(state: IListRecord, action: IPayloadAction, fieldName: string, value: any): IListRecord {
  let _state = state;
  state.get('objections').forEach(objection => {
      action = Object.assign({}, action, {id: objection.id});
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

function updateRebuttalField(state: IListRecord, objectionId: number, rebuttalId: number, fieldName: string, value: any): IListRecord {
    return state.updateIn([
                            'list',
                            'objections',
                            objectionId, 
                            'rebuttals', 
                            rebuttalId, 
                            fieldName], 
                            () => value);
}
