import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BranchRoomAPIService } from '../services/branch-room-api.service';

@Component({
  selector: '[app-detail-room]',
  templateUrl: './detail-room.component.html',
  styleUrls: ['./detail-room.component.css']
})
export class DetailRoomComponent implements OnInit {
  @Input() selectedBranchID!:string
  @Input() selectedRoomID!:string
  @Output() closeModalEvent = new EventEmitter<boolean>()

  room:any
  errMessage:string=''
  close:boolean=true
  status=''

  constructor(private _service:BranchRoomAPIService){}

  ngOnInit(): void {
    this._service.getRoom(this.selectedBranchID,this.selectedRoomID).subscribe({
      next:(data)=>{
        this.room=data,
        this.status = this.room.RoomStatus ? 'Not Booked' : 'Booked';
      },
      error:(err)=>{this.errMessage=err.message}
    })
  }

  closeModal(){
    this.close=false
    this.closeModalEvent.emit(this.close)
  }
}
