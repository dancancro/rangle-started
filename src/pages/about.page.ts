import { Component } from '@angular/core';
import { RioContainer } from '../components';

@Component({
  selector: 'rio-about-page',
  template: `
    <rio-container [size]=4 [center]=true>
      <h2 class="caps">About Us</h2>
      <p>
        This is an app made using the rangle-starter project from Rangle.io. Its purpose is to to demonstrate 
        web development best practices and answer objections to Bernie Sanders.
      </p>
      <a href= "https://github.com/dancancro/rangle-started">GitHub project</a>
    </rio-container>
  `
})
export class RioAboutPage {}
