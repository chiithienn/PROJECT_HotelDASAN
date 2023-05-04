import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';

@Component({
  selector: '[app-detail-account]',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css']
})
export class DetailAccountComponent implements OnInit {
  @Input() selectedAccountID!:string
  @Output() closeModalEvent = new EventEmitter<boolean>()

  account:any
  errMessage:string=''
  close:boolean=true
  gojo="Gojo Satoru"

  constructor(private _service:AccountAPIService){
  }

  ngOnInit(): void {
    this._service.getAccounts().subscribe({
      next:(data)=>{
        this.account = data.find((acc:any) => acc._id === this.selectedAccountID);
      },
      error:(err)=>{this.errMessage=err.message}
    })
  }

  closeModal(){
    this.close=false
    this.closeModalEvent.emit(this.close)
  }
}
