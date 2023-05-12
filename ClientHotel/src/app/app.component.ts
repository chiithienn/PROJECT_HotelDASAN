import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientHotel';

  test=false

  constructor(private router: Router) {}

  isSignInComponent(): boolean {
    // return this.router.url === '/sign-in';
    const hiddenHeaderFooter = ['/sign-in', '/sign-up'];
    return hiddenHeaderFooter.includes(this.router.url);
  }
}
