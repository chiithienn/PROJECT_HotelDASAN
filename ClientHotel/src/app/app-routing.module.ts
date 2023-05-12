import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServiceHotelComponent } from './service-hotel/service-hotel.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ForgetPWComponent } from './forget-pw/forget-pw.component';
import { OverviewComponent } from './overview/overview.component';
import { BookingRoomComponent } from './booking-room/booking-room.component';
import { PaymentComponent } from './payment/payment.component';
import { PersonalPageComponent } from './personal-page/personal-page.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {path: '', redirectTo: '/home-page', pathMatch: 'full'},
  {path:"home-page",component:HomePageComponent},
  {path:"header-menu",component:HeaderMenuComponent},
  {path:"footer-menu",component:FooterMenuComponent},
  {path:'sign-in',component: SignInComponent},
  {path:'sign-up', component: SignUpComponent},
  {path:'forget-password', component: ForgetPWComponent},
  {path:'about-us', component: AboutUsComponent},
  {path:'service-hotel', component: ServiceHotelComponent},
  {path:'promotion', component: PromotionComponent},
  {path:'overview', component: OverviewComponent},
  {path:'booking-room', component: BookingRoomComponent},
  {path:'payment-page', component: PaymentComponent},
  {path:'personal-page', component: PersonalPageComponent},
  {path:'cart-page', component: CartComponent},
  {path:'order-page', component: OrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  HomePageComponent,
  HeaderMenuComponent,
  FooterMenuComponent,
  SignInComponent,
  SignUpComponent,
  ForgetPWComponent,
  AboutUsComponent,
  ServiceHotelComponent,
  PromotionComponent,
  OverviewComponent,
  BookingRoomComponent,
  PaymentComponent,
  PersonalPageComponent,
  CartComponent,
  OrderComponent
]
