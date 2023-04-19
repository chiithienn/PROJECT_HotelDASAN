import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { DetailRoomComponent } from './detail-room/detail-room.component';
import { UpdateRoomComponent } from './update-room/update-room.component';

const routes: Routes = [
  {path: '', redirectTo: '/admin-management', pathMatch: 'full'},
  {path:'admin-management', component:AdminManagementComponent},
  {path:'detail-room', component:DetailRoomComponent},
  {path:'update-room', component:UpdateRoomComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  AdminManagementComponent,
  DetailRoomComponent,
  UpdateRoomComponent
]
