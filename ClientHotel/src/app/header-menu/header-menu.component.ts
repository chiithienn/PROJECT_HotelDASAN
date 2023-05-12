import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { AccountAPIService } from '../services/account-api.service';
import { NavigationEnd, Router } from '@angular/router';
import { OrderAPIService } from '../services/order-api.service';

@Component({
  selector: '[app-header-menu]',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {
  accountID:any
  infoAccount:any
  infoCart:any
  errMessage:string=''

  showDropDown=false
  isPersistentStorage=false
  storageKey=''

  numCartDetail=0

  constructor(private _auth: AuthService, private _accService: AccountAPIService, private _ord: OrderAPIService, private router: Router){ }

  ngOnInit(): void {
    this.getInfoUser()
    this.getInfoCart()
  }

  getInfoUser(){
    this.accountID = this._auth.accountID
    this.isPersistentStorage = this._auth.isPersistentStorage
    this.storageKey = this._auth.storageKey
    this._accService.getInfoUser(this.accountID).subscribe({
      next: (data) => {
        if(!data){
          return
        }
        this.infoAccount = data
       },
      error: (err) => { this.errMessage=err.message }
    })
  }

  getInfoCart(){
    this._ord.getCarts().subscribe({
      next: (data) => {
        this.infoCart = data.filter((cart:any) => cart.AccountID === this.accountID);
        this.numCartDetail = this.infoCart[0]?.CartDetails?.length ?? 0;
      },
      error: (err) => { this.errMessage=err.message }
    })
  }

  openCartPage(){
    if(this.numCartDetail==0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have not added any rooms to your cart yet',
      })
      return
    }
    this.router.navigate(['/cart-page'])
  }

  logout() {
    Swal.fire({
      title: 'Do you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._auth.logout();
        if (location.pathname === '/home-page') {
          location.reload();
        }
        this.router.navigate(['/home-page']);
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home-page') {
            location.reload();
          }
        });
      }
    });
  }
}
