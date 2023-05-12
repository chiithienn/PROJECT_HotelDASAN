import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '[app-service-hotel]',
  templateUrl: './service-hotel.component.html',
  styleUrls: ['./service-hotel.component.css']
})
export class ServiceHotelComponent {
  constructor(private router: Router){}
  openBookingRoom(){
    this.router.navigate(['/booking-room'])
  }
}
