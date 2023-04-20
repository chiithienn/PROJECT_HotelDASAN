import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';

const routes: Routes = [
  {path:"header-menu",component:HeaderMenuComponent},
  {path:"footer-menu",component:FooterMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  HeaderMenuComponent,
  FooterMenuComponent
]
