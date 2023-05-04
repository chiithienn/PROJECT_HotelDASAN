import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartAPIService } from '../services/cart-api.service';

@Component({
  selector: '[app-cart-detail]',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {
  @Input() selectedCartID!:any
  @Output() closeModalEvent = new EventEmitter<boolean>()

  carts:any
  errMessage:string=''
  close:boolean=true

  constructor(private _service: CartAPIService){}

  ngOnInit(): void {
    this._service.getCarts().subscribe({
      next:(data)=>{
        this.carts = data.find((cart:any) => cart._id === this.selectedCartID);
      },
      error:(err)=>{this.errMessage=err.message}
    })
  }

  closeModal(){
    this.close=false
    this.closeModalEvent.emit(this.close)
  }
}
