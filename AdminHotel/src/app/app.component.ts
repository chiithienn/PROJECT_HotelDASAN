import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdminHotel';

  showAdmin=true
  showInfo=false

  showAdminPage(){
    this.showAdmin=true
    this.showInfo=false
  }
  showInfoPage(){
    this.showAdmin=false
    this.showInfo=true
  }
}
