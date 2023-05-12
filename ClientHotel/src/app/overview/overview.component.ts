import { Component, OnInit } from '@angular/core';
import { BranchRoomAPIService } from '../services/branch-room-api.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit{
  branches:any

  constructor(private _room: BranchRoomAPIService){}

  ngOnInit(): void {
    this.getBranches()
  }

  getBranches(){
    this._room.getBranches().subscribe({
      next: (data) => { this.branches=data },
      error: (err) => { alert(err.message) }
    })
  }
}
