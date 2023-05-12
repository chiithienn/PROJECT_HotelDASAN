import { Component } from '@angular/core';
import Swal from 'sweetalert2';

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

  exitAdminPage(){
    Swal.fire({
      title: 'Do you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'http://localhost:4004/sign-in';
      }
    });
  }
}
