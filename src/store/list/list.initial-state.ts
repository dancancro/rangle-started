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
  link: '',
  comments: '',
  editing: false,
  original: null,
  isTouched: function() {
    return this.original && (this.original.shortName !== this.shortName ||
      this.original.longName !== this.longName ||
      this.original.link !== this.link ||
      (this.original.comments || '') !== (this.comments || ''));
  }
});

export const NewRebuttalFactory = makeTypedFactory<IRebuttal, IRebuttalRecord>({
  id: null,
  shortName: '',
  longName: '',
  link: '',
  comments: '',
  editing: true,
  original: null,
  isTouched: function() { return true; }
});

export const INITIAL_REBUTTAL_STATE = RebuttalFactory();

export const ObjectionFactory = makeTypedFactory<IObjection, IObjectionRecord>({
  rebuttals: List<IRebuttal>(INITIAL_REBUTTAL_STATE),
  id: null,
  name: 'New Objection',
  rebuttalsReordered: false,
  expanded: false,
  isAdding: function() {
    return this.rebuttals.find((rebuttal) => rebuttal.editing && (rebuttal.id === null)) !== undefined;
  }
});

export const INITIAL_OBJECTION_STATE = ObjectionFactory();

export const ListFactory = makeTypedFactory<IList, IListRecord>({
  objections: List<IObjection>(INITIAL_OBJECTION_STATE),
  editable: false, 
  expanded: false,
  isTouched: function() {
    let _touched = false;
    // TODO make this a for loop with early exits
    this.objections.forEach(objection => {
      objection.rebuttals.forEach(rebuttal => {
        if ( rebuttal.isTouched() ) {
          _touched = true;
        }
      });
    });
    return _touched;
  }

});

export const INITIAL_LIST_STATE = ListFactory();
