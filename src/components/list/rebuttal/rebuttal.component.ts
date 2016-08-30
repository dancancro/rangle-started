import { Component, Input, Output, EventEmitter, OnInit,
         ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IList, IObjection, IRebuttal } from '../../../store/list/list.types';

@Component({
    moduleId: module.id,
    selector: 'list-rebuttal',
    template: require('./rebuttal.component.html'),
    styles: [require('./rebuttal.component.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RebuttalComponent implements OnInit {
  @Input() list: IList;
  @Input() objection: IObjection;
  @Input() rebuttal: IRebuttal;

  @Output() cancel = new EventEmitter();
  @Output() makeEditable = new EventEmitter();
  @Output() save = new EventEmitter();

  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
      this.editForm = this.formBuilder.group({
        shortName: [this.rebuttal.shortName, Validators.required],
        longName: [this.rebuttal.longName, Validators.required],
        link: this.rebuttal.link,
        comments: this.rebuttal.comments
      });
    }

}
