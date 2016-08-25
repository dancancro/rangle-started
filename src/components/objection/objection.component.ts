import { Component, Input, Output, 
         EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// import { SortablejsOptions, SORTABLEJS_DIRECTIVES } from 'angular-sortablejs';
import { SortablejsOptions} from 'angular-sortablejs';

import { IList, IObjection, IRebuttal } from '../../store/list/list.types';
import { RebuttalComponent } from '../rebuttal/rebuttal.component';
// import { ListActions } from '../../actions/list.actions';

@Component({
    moduleId: module.id,
    selector: 'list-objection',
    template: require('./objection.component.html'),
    styles: [require('./objection.component.css')],
   // providers: [ListActions],
 //   directives: [RebuttalComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionComponent {
    @Input() list: IList;
    @Input() objection: IObjection;
    @Input() editable = false;
    @Output() toggleRebuttals = new EventEmitter();
    @Output() reorderObjections = new EventEmitter();
    @Output() cancelRebuttal = new EventEmitter();
    @Output() saveRebuttal = new EventEmitter();
    @Output() editRebuttal = new EventEmitter();
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

}
