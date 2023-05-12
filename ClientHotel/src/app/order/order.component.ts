import { Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { OrderAPIService } from '../services/order-api.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  accountID:any
  user:any
  orders:any
  testOrder:any

  showModalDetail:boolean=false
  orderSelected:any

  constructor(private _acc: AccountAPIService, private _ord: OrderAPIService, private _auth: AuthService, private router: Router){

  }

  ngOnInit(): void {
    this.accountID = this._auth.accountID
    this.getUser()
    this.getOrder()
  }

  getUser(){
    if(this.accountID){
      this._acc.getInfoUser(this.accountID).subscribe({
        next: (data) => { this.user = data },
        error: (err) => { alert(err.message) }
      })
    }
  }

  getOrder(){
    if(this.accountID){
      this._ord.getOrders().subscribe({
        next: (data) => {
          this.orders = data.filter((order:any) => order.AccountID === this.accountID);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })
        }
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: 'You have not posted.<br>Please login to access the page!',
        preConfirm: () => {
          this.router.navigate(['/home-page']);
        }
      })
    }
  }

  viewModalDetail(order:any){
    this.showModalDetail = true
    this.orderSelected = order
  }

  closeDetail(){
    this.showModalDetail = false
  }

  openCartPage(){
    this.router.navigate(['/cart-page'])
  }
  openPersonalPage(){
    this.router.navigate(['/personal-page'])
  }
  openOrderPage(){
    window.location.reload()
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
