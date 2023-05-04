import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderOrderDetailAPIService } from '../services/order-order-detail-api.service';

@Component({
  selector: '[app-order-detail]',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit{
  @Input() selectedOrderID!:any
  @Output() closeModalEvent = new EventEmitter<boolean>()

  orders:any
  errMessage:string=''
  close:boolean=true

  constructor(private _service: OrderOrderDetailAPIService){}

  ngOnInit(): void {
    this._service.getOrders().subscribe({
      next:(data)=>{
        this.orders = data.find((ord:any) => ord._id === this.selectedOrderID);
      },
      error:(err)=>{this.errMessage=err.message}
    })
  }

  closeModal(){
    this.close=false
    this.closeModalEvent.emit(this.close)
  }
}
