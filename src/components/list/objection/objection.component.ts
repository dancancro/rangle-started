import { Component, Input, Output, OnInit,
         EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// import { SortablejsOptions, SORTABLEJS_DIRECTIVES } from 'angular-sortablejs';
import { SortablejsOptions} from 'angular-sortablejs';

import { IList } from '../../../store/list/list.types';
import { IListRecord } from '../../../store/list/list.types';
import { IObjection } from '../../../store/list/list.types';
import { IObjectionRecord } from '../../../store/list/list.types';
import { IRebuttal } from '../../../store/list/list.types';
import { RebuttalComponent } from '../rebuttal/rebuttal.component';

@Component({
    moduleId: module.id,
    selector: 'list-objection',
    template: require('./objection.component.html'),
    styles: [require('./objection.component.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionComponent implements OnInit {
    @Input() list: IList;
    @Input() objection: IObjection;

    @Output() toggleRebuttals = new EventEmitter();
    @Output() reorderObjections = new EventEmitter();
    @Output() cancelRebuttal = new EventEmitter();
    @Output() saveRebuttal = new EventEmitter();
    @Output() makeRebuttalEditable = new EventEmitter();
    @Output() addRebuttal = new EventEmitter();

    options: SortablejsOptions = {
        handle: '.drag-handle',
        disabled: false,
        group: {
            name: 'a',
            pull: 'clone'
        },
        animation: 0
    };

  ngOnInit() { 
//      debugger; 
 //   console.log('objection.oninit list properties: ' + Object.keys(this.list));
 //   console.log('objection.oninit objection properties: ' + Object.keys(this.objection));
  }

/*
    sortOn(...args: any[]) {

        return function (a, b) {
            let fieldNames = Object.keys(args)
                .filter(function (i) { return +i % 2 === 0; })
                .map(function (i) { return args[i]; });
            let directions = Object.keys(args)
            .filter(function (i) { return +i % 2 === 1; })
            .map(function (i) { return parseInt(args[i], 10); });

            for (let i = 0; i < fieldNames.length; i++) {
                if (a[fieldNames[i]] > b[fieldNames[i]]) {
                    return directions[i];
                }
                if (a[fieldNames[i]] < b[fieldNames[i]]) {
                    return -directions[i];
                }
            }
            // a must be equal to b
            return 0;
        };
    }
*/
}
