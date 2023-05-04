import { Component } from '@angular/core';
import { BranchRoomAPIService } from '../services/branch-room-api.service';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent {
  branches:any
  errMessage:string=''
  branchValue='Hồ Chí Minh'

  selectedBranchID:string=''
  selectedRoomID:string=''
  roomIds: string[] = [];

  public dataLoaded: boolean = false;
  showUpdateRoom=false
  showDetailRoom=false
  showCreateRoom=false

  constructor(private _service: BranchRoomAPIService){
    this._service.getBranches().subscribe({
      next: (data)=> {
        this.branches=data,
        this.dataLoaded = true;
      },
      error: (err)=> {this.errMessage=err},
    })
  }

  handleClick(event: any) {
    this.branchValue = event.target.textContent;
  }

  openUpdateRoom(branchID:string, roomID:string){
    this.selectedBranchID = branchID
    this.selectedRoomID = roomID
    this.showUpdateRoom=true
  }
  openDetailRoom(branchID:string, roomID:string){
    this.selectedBranchID = branchID
    this.selectedRoomID = roomID
    this.showDetailRoom=true
  }
  openCreateRoom(branchID:string){
    this.selectedBranchID = branchID
    this.showCreateRoom=true
  }

  closeModalUpdate(showUpdateRoom: boolean){
    this.showUpdateRoom = showUpdateRoom
  }
  closeModalDetail(showDetailRoom: boolean){
    this.showDetailRoom = showDetailRoom
  }
  closeModalCreate(showCreateRoom: boolean){
    this.showCreateRoom = showCreateRoom
  }

  // Thực hiện lấy roomID tương ứng vào trong mảng roomIds
  toggleRoomId(roomId: string) {
    if (this.roomIds.includes(roomId)) {
      this.roomIds.splice(this.roomIds.indexOf(roomId), 1);
    } else {
      this.roomIds.push(roomId);
    }
  }

  deleteRoom(branchID:string, roomID:string){
    if(confirm('Bạn có chắc chắn muốn xoá Room này không?')){
      this._service.deleteRoom(branchID,roomID).subscribe({
        next:(data)=>{
          this.branches=data;
          alert("Đã xoá thành công");
          window.location.reload()
        },
        error:(err)=>{this.errMessage=err.message},
      })
    }
  }

  deleteRooms(branchID:string){
    if (this.roomIds.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng để xoá.");
      return;
    }
    if(confirm('Bạn có chắc chắn muốn xoá Room này không?')){
      this._service.deleteRooms(branchID,this.roomIds).subscribe({
        next:()=>{
          alert("Đã xoá thành công");
          window.location.reload()
        },
        error:(err)=>{this.errMessage=err.message},
      })
    }
  }
}
