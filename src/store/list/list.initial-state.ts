import {
  IList,
  IListRecord,
  IObjection,
  IObjectionRecord,
  IRebuttal,
  IRebuttalRecord
} from './list.types';
import { makeTypedFactory } from 'typed-immutable-record';
import { Map, Record, List } from 'immutable';

export const RebuttalFactory = makeTypedFactory<IRebuttal, IRebuttalRecord>({
  id: null,
  shortName: '',
  longName: '',
  touched: false,
  editing: false
});

export const ObjectionFactory = makeTypedFactory<IObjection, IObjectionRecord>({
  rebuttals: List<IRebuttal>(),
  id: null,
  name: '',
  reordered: false,
  expanded: false
});

export const ListFactory = makeTypedFactory<IList, IListRecord>({
  objections: List<IObjection>(),
  editable: false, 
  expanded: false,
  isTouched: function() {
    let _touched = false;
    // TODO make this a for loop with early exits
    this.objections.forEach(objection => {
      objection.get('rebuttals').forEach(rebuttal => {
        if ( rebuttal.touched ) {
          _touched = true;
        }
      });
    });
    return _touched;
  }

});

export const INITIAL_REBUTTAL_STATE = RebuttalFactory();
export const INITIAL_OBJECTION_STATE = ObjectionFactory();
export const INITIAL_LIST_STATE = ListFactory();
