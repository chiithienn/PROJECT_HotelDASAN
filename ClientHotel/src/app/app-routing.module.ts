import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {path:"header-menu",component:HeaderMenuComponent},
  {path:"footer-menu",component:FooterMenuComponent},
  {path:'SignIn',component: SignInComponent},
  {path:'SignUp', component: SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  HeaderMenuComponent,
  FooterMenuComponent,
  SignInComponent,
  SignUpComponent
]
