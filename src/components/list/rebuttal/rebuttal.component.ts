import { Component, Input, Output, EventEmitter, 
         ChangeDetectionStrategy } from '@angular/core';

import { IList, IObjection, IRebuttal } from '../../../store/list/list.types';

@Component({
    moduleId: module.id,
    selector: 'list-rebuttal',
    template: require('./rebuttal.component.html'),
    styles: [require('./rebuttal.component.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RebuttalComponent {
  @Input() list: IList;
  @Input() objection: IObjection;
  @Input() rebuttal: IRebuttal;

  @Output() cancel = new EventEmitter();
  @Output() makeEditable = new EventEmitter();
  @Output() save = new EventEmitter();
}
