import { Map, Record, List } from 'immutable';
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

  // methods
  // set: (prop: string, val: any) => IObjection;
  // merge: (other: any) => IObjection;

  // UI state
  reordered: boolean;
  expanded: boolean;
};

export interface IObjectionRecord extends TypedRecord<IObjectionRecord>, IObjection {

}

/**********************************************************************************/
/*******************************  LISTS *******************************************/
/**********************************************************************************/

// A single list of multiple objections plus some UI state
// I had this as 'extends List' to say that the IList IS a list 
// of IObjections but that didn't work. It seems that the IList 
// must HAVE a list of IObjections'
export interface IList {
  // data
//  objections: List<IObjection>;
  objections: List<IObjection>;

  // methods
//  set: (key: string, val: any) => IList;
//  merge: (other: any) => IList;

  // UI state
  touched: boolean;
  editable: boolean; 
  expanded: boolean;
};


export interface IListRecord extends TypedRecord<IListRecord>,
  IList {
};

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

  // methods
  // set: (prop: string, val: any) => IRebuttal;
  // merge: (other: any) => IRebuttal;

  // UI state
  touched: boolean;
  editing: boolean;
}



export interface IRebuttalRecord extends TypedRecord<IRebuttalRecord>,
  IRebuttal {
};











/*

// I'm not sure about this
export const ListRecord = Record({
  objections: List(),
//  touched: false,
  editable: false, 
  expanded: false,

  isTouched(): boolean {
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

export const ObjectionRecord = Record({
  id: '',
  name: '',
  imgLink: '',
  rebuttals: List(),
  expanded: false,
  rebuttalsReordered: false
});

export const RebuttalRecord = Record({
  // data
  id: 0,
  shortName: '',
  longName: '',
  link: '',
  comments: '',
  
  // UI state
  touched: false,
  editing: false
});

*/
