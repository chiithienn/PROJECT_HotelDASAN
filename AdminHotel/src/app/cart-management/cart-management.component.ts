import { Component } from '@angular/core';
import { CartAPIService } from '../services/cart-api.service';

@Component({
  selector: 'app-cart-management',
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.css']
})
export class CartManagementComponent {
  carts:any
  errMessage:string=''
  high='high'
  med='medium-low'

  selectedCartID:any
  showCartDetail=false

  constructor(private _service: CartAPIService){
    _service.getCarts().subscribe({
      next: (data) => { this.carts=data },
      error: (err) => { this.errMessage=err.message }
    })
  }

  openCartDetail(cartID:any){
    this.selectedCartID=cartID
    this.showCartDetail=true
  }

  closeModalDetail(showCartDetail: boolean){
    this.showCartDetail = showCartDetail
  }
}
