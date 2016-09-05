import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { IObjection } from '../store/list/list.types';

@Injectable()
export class DataService {
    result: Object;
    combined: any;
    error: Object;
    // getUrl: string = 'https://script.google.com/macros/s/AKfycbymzGKzgGkVo4kepy9zKIyDlxbnLbp-ivCvj8mVMClmWgr-V-g/exec?json=1';
    // getUrl: string = '/objections.json';  // faster. use for dev
    // postUrl: string = 'https://script.google.com/macros/s/AKfycbymzGKzgGkVo4kepy9zKIyDlxbnLbp-ivCvj8mVMClmWgr-V-g/exec';
    postUrl: string = '/api/list';
    getUrl: string = __DEV__ ? '/objections.json' : 'https://script.google.com/macros/s/AKfycbymzGKzgGkVo4kepy9zKIyDlxbnLbp-ivCvj8mVMClmWgr-V-g/exec?json=1';


    constructor(private http: Http) {
    }

    getObjections(): Observable<IObjection[]> {
        // returns an observable of the response
        return this.http.get(this.getUrl) 
            .map(response => {
                  return response.json();
                }); // transforms it into an observable of IObjections
    }

    static getOriginalRebuttal(oldObjections, objectionId, rebuttalId) {
        return oldObjections.filter((objection) => objection.id === objectionId)[0].rebuttals.filter((rebuttal) => rebuttal.id === rebuttalId)[0];
    }

    static getOrderings(oldObjections, newObjections) {
        return newObjections.filter(objection => objection.rebuttalsReordered)
            .map(objection => {
                return {
                    'id': objection.id,
                    'rebuttals': objection.rebuttals
                                    .map(rebuttal => rebuttal.id)
                };
            }
            );
    }

    static getEdits(oldObjections, newObjections) {
        let edits = [];
        newObjections.forEach(objection =>
            objection.rebuttals.filter(rebuttal => rebuttal.touched && rebuttal.id)
            .forEach(rebuttal => {
                let originalRebuttal = DataService.getOriginalRebuttal(oldObjections, objection.id, rebuttal.id);
                let edit = { rebuttalId: rebuttal.id };
                if ( originalRebuttal.shortName !== rebuttal.shortName ) { edit['shortName'] = rebuttal.shortName; }
                if ( originalRebuttal.longName !== rebuttal.longName ) { edit['longName'] = rebuttal.longName; }
                if ( originalRebuttal.link !== rebuttal.link ) { edit['link'] = rebuttal.link; }
                if ( rebuttal.comments !== '' ) { edit['comments'] = rebuttal.comments; }
                edits.push(edit);
            })
        );
        return edits;
    }
    
    saveObjections(oldObjections, newObjections) {

        let submission = JSON.stringify({
            'orderings': DataService.getOrderings(oldObjections, newObjections),
            'edits': DataService.getEdits(oldObjections, newObjections)
        });

        console.log(submission);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.postUrl, submission, { headers: headers });
    }
}

