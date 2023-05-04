import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { DetailRoomComponent } from './detail-room/detail-room.component';
import { UpdateRoomComponent } from './update-room/update-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { DetailAccountComponent } from './detail-account/detail-account.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';

const routes: Routes = [
  {path: '', redirectTo: '/admin-management', pathMatch: 'full'},
  {path:'admin-management', component:AdminManagementComponent},
  {path:'detail-room', component:DetailRoomComponent},
  {path:'update-room', component:UpdateRoomComponent},
  {path:'create-room', component:CreateRoomComponent},
  {path:'account-management', component:AccountManagementComponent},
  {path:'detail-account', component:DetailAccountComponent},
  {path:'cart-management', component:CartManagementComponent},
  {path:'order-management', component:OrderManagementComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  AdminManagementComponent,
  DetailRoomComponent,
  UpdateRoomComponent,
  CreateRoomComponent,
  AccountManagementComponent,
  DetailAccountComponent,
  CartManagementComponent,
  OrderManagementComponent
]
