import { Component } from '@angular/core';
import { OrderOrderDetailAPIService } from '../services/order-order-detail-api.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent {
  orders:any
  errMessage:string=''
  selectedOrderID:any
  showOrderDetail=false
  high='high'
  med='medium-low'

  constructor(private _service: OrderOrderDetailAPIService) {
    _service.getOrders().subscribe({
      next: (data) => {this.orders=data},
      error: (err) => {this.errMessage = err.message}
    })
  }

  openOrderDetail(orderID:any){
    this.selectedOrderID=orderID
    this.showOrderDetail=true
  }

  closeModalDetail(showOrderDetail: boolean){
    this.showOrderDetail = showOrderDetail
  }
}
