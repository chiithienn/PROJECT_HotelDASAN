import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomHotel } from '../model/BranchRoom';
import { BranchRoomAPIService } from '../services/branch-room-api.service';

@Component({
  selector: '[app-create-room]',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  @Input() selectedBranchID!:string
  @Output() closeModalEvent = new EventEmitter<boolean>()

  room = new RoomHotel()
  branch:any
  errMessage:string=''
  close=true
  booked=false
  notbooked=true
  valid = "btn-update"
  invalid = "validation"

  constructor(private _service:BranchRoomAPIService){}

  ngOnInit(): void {
    this._service.getBranch(this.selectedBranchID).subscribe({
      next: (data) => {this.branch=data},
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

  postRoom(){
    // this.roo.style = this.fashion.style.toUpperCase()
    this._service.postRoom(this.room, this.selectedBranchID).subscribe({
      next:(data)=>{
        this.room=data;
        alert("Đã tạo Room mới thành công");
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
