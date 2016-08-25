// The data is not normalized. There's a many-many relationship 
// between objections and rebuttals

import { IList, IObjection, IRebuttal, ListRecord } from './list.types';
import { Map, List, Record} from 'immutable';

export function deimmutifyList(list: IList): Object[] {
   return list.toJS();
}

export function reimmutifyList(plain): IList {
  return new ListRecord(
    Object.assign(
      {},
      plain,
      {
        objections: 
          List(plain.objections 
                 ? plain.objections.map(reimmutifyObjection) 
                 : [])   
      }
  ));
}

function reimmutifyObjection(plain: any): IObjection {
  return <IObjection>Object.assign(
    {},
    plain,
    Map({
      rebuttals: 
        List(plain.rebuttals 
                ? plain.rebuttals.map(reimmutifyRebuttal)
                : [])
    })
  );
}

function reimmutifyRebuttal(plain: any) {
  return <IRebuttal>Object.assign(
    {},
    plain,
    Map({
        id: plain.id,
        shortName: plain.shortName,
        longName: plain.longName,
        link: plain.link,
        comments: plain.comments, 

        touched: plain.touched,
        editing: plain.editing
    })   
  );
}
