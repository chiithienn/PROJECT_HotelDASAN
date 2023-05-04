import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { DetailRoomComponent } from './detail-room/detail-room.component';
import { UpdateRoomComponent } from './update-room/update-room.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { DetailAccountComponent } from './detail-account/detail-account.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    AdminManagementComponent,
    DetailRoomComponent,
    UpdateRoomComponent,
    CreateRoomComponent,
    AccountManagementComponent,
    DetailAccountComponent,
    CartManagementComponent,
    OrderManagementComponent,
    OrderDetailComponent,
    CartDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
