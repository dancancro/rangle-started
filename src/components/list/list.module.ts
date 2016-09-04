import {NgModule}      from '@angular/core';
// import {CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ListPage } from '../../pages/list.page';
import { ObjectionComponent } from './objection/objection.component';
import { RebuttalComponent } from './rebuttal/rebuttal.component';
import { SORTABLEJS_DIRECTIVES } from 'angular-sortablejs';
import { DataService } from '../../services/data.service';

import { AsyncPipe } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    ListPage,
    ObjectionComponent,
    RebuttalComponent,
    SORTABLEJS_DIRECTIVES,
  ],
  exports: [
    ListPage,
    ObjectionComponent,
    RebuttalComponent,
    BrowserModule
  ],
  providers: [
    DataService
  ]
})
export class ListModule { }
