import { Component, Input, Output, EventEmitter, 
         ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { select } from 'ng2-redux';

import { IList, IObjection, IRebuttal } from '../../store/list/list.types';
import { ListModule } from '../list/list.module';

@Component({
    moduleId: module.id,
    selector: 'list-rebuttal',
    template: require('./rebuttal.component.html'),
    styles: [require('./rebuttal.component.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RebuttalComponent {
  @select(['list', 'editable']) editable: boolean;
  @Input() list: IList;
  @Input() objection: IObjection;
  @Input() rebuttal: IRebuttal;
  @Output() cancel = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() save = new EventEmitter();
}
