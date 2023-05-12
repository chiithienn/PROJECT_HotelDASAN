import { Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { OrderAPIService } from '../services/order-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  accountID:any
  user:any
  cart:any

  cartID:any
  CartDetail=[
    {
      RoomID: '',
      Branch: "",
      RoomType: "",
      Price: 0,
      Adults: 1,
      Children: 0,
      CheckInDate: "",
      CheckOutDate: ""
    }
  ]

  constructor(
    private _acc: AccountAPIService,
    private _ord: OrderAPIService,
    private _auth: AuthService,
    private router: Router){

  }

  ngOnInit(): void {
    this.accountID = this._auth.accountID
    this.getUser()
    this.getCart()
  }

  getUser(){
    if(this.accountID){
      this._acc.getInfoUser(this.accountID).subscribe({
        next: (data) => { this.user = data },
        error: (err) => { alert(err.message) }
      })
    }
  }

  getCart(){
    if(this.accountID){
      this._ord.getCarts().subscribe({
        next: (data) => {
          this.cart = data.find((cart:any) => cart.AccountID === this.accountID);
        },
        error: (err) => { alert(err.message) }
      })
    }
  }

  addToCart(cartDetail:any){
    this.CartDetail=[
      {
        RoomID: cartDetail.RoomID,
        Branch: cartDetail.Branch,
        RoomType: cartDetail.RoomType,
        Price: cartDetail.Price,
        Adults: cartDetail.Adults,
        Children: cartDetail.Children,
        CheckInDate: cartDetail.CheckInDate,
        CheckOutDate: cartDetail.CheckOutDate
      }
    ]

    this.deleteCartDetail(cartDetail._id)
    this._ord.addCart(this.accountID,this.CartDetail).subscribe({
      next: (data) => {
        this.cart=data,
        this.getCart()
       },
      error: (err) => { alert(err.message) }
    })
  }
  deleteCartDetail(cartDetailID:any){
    this._ord.deleteCartDetail(cartDetailID).subscribe({
      next: () => {
        this.getCart()
      },
      error: (err) => { alert(err.message) }
    })
  }

  bookRoom(cartID:any){
    if (this.cart.CartDetails.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Cart is empty! Please add items to the cart before booking.',
      })
      return;
    }
    this.router.navigate(['/payment-page']);
  }

  openCartPage(){
    window.location.reload()
  }
  openPersonalPage(){
    this.router.navigate(['/personal-page'])
  }
  openOrderPage(){
    this.router.navigate(['/order-page'])
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
