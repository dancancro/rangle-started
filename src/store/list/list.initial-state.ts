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
  id: undefined,
  shortName: '',
  longName: '',
  touched: false,
  editing: false
});

export const INITIAL_REBUTTAL_STATE = RebuttalFactory();

export const ObjectionFactory = makeTypedFactory<IObjection, IObjectionRecord>({
  rebuttals: List<IRebuttal>(),
  id: undefined,
  name: '',
  reordered: false,
  expanded: false
});

export const INITIAL_OBJECITON_STATE = ObjectionFactory();

export const ListFactory = makeTypedFactory<IList, IListRecord>({
  objections: List<IObjection>(),
  touched: false,
  editable: false, 
  expanded: false
});

export const INITIAL_STATE = ListFactory();
