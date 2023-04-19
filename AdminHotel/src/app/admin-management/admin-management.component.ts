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

  selectedBranchID:string=''
  selectedRoomID:string=''

  showUpdateRoom=false
  showDetailRoom=false

  constructor(private _service: BranchRoomAPIService){
    this._service.getBranches().subscribe({
      next: (data)=> {this.branches=data},
      error: (err)=> {this.errMessage=err},
    })
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

  closeModalUpdate(showUpdateRoom: boolean){
    this.showUpdateRoom = showUpdateRoom
  }
  closeModalDetail(showDetailRoom: boolean){
    this.showDetailRoom = showDetailRoom
  }
}
