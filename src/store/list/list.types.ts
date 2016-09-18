import { List } from 'immutable';
import { Map } from 'immutable';
import { Record } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';

/**********************************************************************************/
/**************************  OBJECTIONS *******************************************/
/**********************************************************************************/

// A single objection plus some UI state
export interface IObjection {
  // data
  rebuttals: List<IRebuttal>;
  id: number;
  name: string;
  imgHref?: string;
  imgSrc?: string;
  star?: boolean;
  
  // UI state
  rebuttalsReordered: boolean;
  expanded: boolean;

  // methods
  isAdding: Function;
};

export interface IObjectionRecord extends TypedRecord<IObjectionRecord>, IObjection {};

/**********************************************************************************/
/*******************************  LISTS *******************************************/
/**********************************************************************************/

// A single list of multiple objections plus some UI state
// I had this as 'extends List' to say that the IList IS a list 
// of IObjections but that didn't work. It seems that the IList 
// must HAVE a list of IObjections'
export interface IList {
  // data
  objections: List<IObjection>;

  // UI state
  editable: boolean; 
  expanded: boolean;
  scrollY: number;

  // methods
  isTouched: Function;
};


export interface IListRecord extends TypedRecord<IListRecord>, IList {};

/**********************************************************************************/
/*******************************  REBUTTALS ***************************************/
/**********************************************************************************/

// A single Rebuttal and some UI state
export interface IRebuttal {
  // data
  id: number;
  shortName: string;
  longName: string;
  link?: string;
  comments?: string;

  // UI state
  editing: boolean;
  original?: IRebuttal;

  // methods
  isTouched: Function;
}

export interface IRebuttalRecord extends TypedRecord<IRebuttalRecord>, IRebuttal {};
