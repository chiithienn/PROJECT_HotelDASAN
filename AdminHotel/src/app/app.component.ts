import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdminHotel';

  hotel=false
  account=false
  cart=false
  order=false

  setActive(activeTab: string) {
    this.hotel = false;
    this.account = false;
    this.cart = false;
    this.order = false;

    switch(activeTab) {
      case 'hotel':
        this.hotel = true;
        break;
      case 'account':
        this.account = true;
        break;
      case 'cart':
        this.cart = true;
        break;
      case 'order':
        this.order = true;
        break;
      default:
        break;
    }
  }
}
