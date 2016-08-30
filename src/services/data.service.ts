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
     getUrl: string = '/objections.json';  // faster. use for dev
    postUrl: string = 'https://script.google.com/macros/s/AKfycbymzGKzgGkVo4ke'
    + 'py9zKIyDlxbnLbp-ivCvj8mVMClmWgr-V-g/exec';

    // static getObjection(objections: any[], id: number): ObjectionModel {
    //     return objections.filter(function(objection) {
    //         return objection.id === id
    //     })[0];
    // }

    constructor(private http: Http) {
    }

    getObjections(): Observable<IObjection[]> {
        // returns an observable of the response
        return this.http.get(this.getUrl) 
            .map(response => {
                  return response.json();
                }); // transforms it into an observable of IObjections
    }

    saveObjections(objections) {

        let submission = JSON.stringify({
            'orderings': getOrderings(objections),
            'edits': getRebuttalEdits(objections)
        });
     //   console.log(submission);

        function getOrderings(obs) {
            return obs.filter(objection => objection.rebuttalsReordered)
                .map(objection => {
                    return {
                        'id': objection.id,
                        'rebuttals': objection.rebuttals
                                     .map(rebuttal => rebuttal.id)
                    };
                }
                );
        }

        function getRebuttalEdits(obs) {
            let edits = [];
            obs.forEach(objection =>
                objection.rebuttals.filter(
                    rebuttal => rebuttal.touched).forEach(rebuttal =>
                    edits.push({
                        'rebuttalId': rebuttal.id,
                        'shortName': 
                        rebuttal.oldShortName === rebuttal.shortName ? '' 
                                               : rebuttal.shortName,
                        'longName': rebuttal.oldLongName 
                                       === rebuttal.longName ? '' 
                                                          : rebuttal.longName,
                        'link': rebuttal.oldLink === rebuttal.link ? '' 
                                                  : rebuttal.link,
                        'comments': rebuttal.comments
                    })
                )
            );
            return edits;
        }


        alert('Thank you! We have received your change suggestions ' 
        + 'and will review them for inclusion in the resource.');



        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.postUrl, submission, { headers: headers })
            .map((res: Response) => res.json());
           // .subscribe();
           // .subscribe(( res ) => this.postResponse = res);

    }
}

