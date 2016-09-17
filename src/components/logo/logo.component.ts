import { Component } from '@angular/core';

@Component({
  selector: 'rio-logo',
  styles: [require('./logo.css')],
  template: `
    <div className="flex items-center">
      <img
        class="logo"
        [src]="LogoImage"
        alt="Bernie Rebuttals"
      />
    </div>
  `
})
export class RioLogo {
  private LogoImage = '../../assets/bernie-sanders-128.jpg';
//  private LogoImage = require('../../assets/bernie-sanders-128.jpg');  // need a jpg loader for this
};
