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
    return false;
    // this.original && this.original.shortName !== this.shortName ||
    //   this.original.longName !== this.longName ||
    //   this.original.link !== this.link ||
    //   (this.original.comments || '') !== (this.comments || '');
  }
});

// Do this to extend an entity
export const NewRebuttalFactory = makeTypedFactory<IRebuttal, IRebuttalRecord>(RebuttalFactory().merge({
  editing: true,
  isTouched: function() { return true;}
}));

export const ObjectionFactory = makeTypedFactory<IObjection, IObjectionRecord>({
  rebuttals: List<IRebuttal>(),
  id: null,
  name: 'New Objection',
  rebuttalsReordered: false,
  expanded: false,
  isAdding: function() {
    return this.rebuttals.find((rebuttal) => rebuttal.editing && (rebuttal.id === null)) !== undefined;
  }
});

export const ListFactory = makeTypedFactory<IList, IListRecord>({
  objections: List<IObjection>(),
  editable: false, 
  expanded: false,
  isTouched: function() {
    let _touched = false;
    // TODO make this a for loop with early exits
    this.objections.forEach(objection => {
    let i = 0;
      objection.rebuttals.forEach(rebuttal => {
        i++;
        if (typeof rebuttal === 'undefined') {
          console.log(objection.name + ' has an undefined rebuttal at position ' + i);
        }
        if ( rebuttal.isTouched() ) {
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
