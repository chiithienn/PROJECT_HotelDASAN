import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { AuthService } from '../services/auth.service';
import { OrderAPIService } from '../services/order-api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit, OnInit {
  accountID=''
  user:any
  cart:any

  dataLoaded:boolean=false
  showPayment=true
  showSuccess=false

  constructor(private _acc: AccountAPIService, private _ord: OrderAPIService, private _auth: AuthService){}

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.accountID = this._auth.accountID
    this.getInfo()
    this.getCart()
  }

  getInfo(){
    this._acc.getInfoUser(this.accountID).subscribe({
      next: (data) => { this.user = data },
      error: (err) => { alert(err.message) }
    })
  }

  getCart(){
    this._ord.getCarts().subscribe({
      next: (data) => {
        this.cart = data.find((cart:any) => cart.AccountID === this.accountID);
       },
      error: (err) => { alert(err.message) }
    })
  }

  createOrder(){
    this.dataLoaded = true
    this._ord.createOrder(this.cart._id).subscribe({
      next: () => {
        setTimeout(() => {
          this.dataLoaded = false;
          this.showSuccess = true
          this.showPayment = false
        }, 5000);
        // window.location.reload()
      },
      error: (err) => { alert(err.message) }
    })
  }
}
