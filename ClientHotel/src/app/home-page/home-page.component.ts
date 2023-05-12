import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: '[app-home-page]',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  accountID:any;

  constructor(private authService: AuthService, private router: Router) {
    this.accountID = authService.accountID;
  }
}
