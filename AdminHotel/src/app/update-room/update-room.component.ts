import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomHotel } from '../model/BranchRoom';
import { BranchRoomAPIService } from '../services/branch-room-api.service';

@Component({
  selector: '[app-update-room]',
  templateUrl: './update-room.component.html',
  styleUrls: ['./update-room.component.css']
})
export class UpdateRoomComponent implements OnInit {
  @Input() selectedBranchID!:string
  @Input() selectedRoomID!:string
  @Output() closeModalEvent = new EventEmitter<boolean>()

  branches:any
  errMessage:string=''
  close:boolean=true
  booked=true
  notbooked=false

  room = new RoomHotel()

  constructor(private _service: BranchRoomAPIService){
    this._service.getBranches().subscribe({
      next: (data) => {this.branches=data},
      error: (err) => {this.errMessage=err.message}
    })
  }

  ngOnInit(): void {
    this.room._id = this.selectedRoomID
    this._service.getRoom(this.selectedBranchID, this.selectedRoomID).subscribe({
      next: (data) => {this.room=data},
      error: (err) => {this.errMessage=err.message}
    })
  }

  public setRoom(f:RoomHotel){
    this.room = f
  }
  onFileSelected(event:any, room:RoomHotel){
    let me = this;
    let file = event.target.files[0]
     let reader = new FileReader()
     reader.readAsDataURL(file);
     reader.onload = function(){
      room.RoomImage = reader.result!.toString()
     }
     reader.onerror = function (error){
      console.log('Error: ',error)
     }
  }

  putRoom(){
    this._service.putRoom(this.room,this.selectedBranchID,this.selectedRoomID).subscribe({
      next:(data)=>{
        this.branches=data,
        alert("Đã cập nhật thành công"),
        location.reload()
      },
      error:(err)=>{this.errMessage=err}
    })
  }

  closeModal(){
    this.close=false
    this.closeModalEvent.emit(this.close)
  }
}
