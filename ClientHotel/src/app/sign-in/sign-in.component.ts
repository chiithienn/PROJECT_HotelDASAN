import { Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: '[app-sign-in]',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit{
  accountName: string="";
  password: string="";
  rmbAccount=false
  loginStatus=true
  storageKey=''

  account:any
  errMessage:string=''

  constructor(private _service: AccountAPIService, private _auth: AuthService, private router: Router){}
  ngOnInit(): void {

  }

  changeRmb(){
    this.rmbAccount = !(this.rmbAccount)
  }

  login(){
    this._service.login(this.accountName,this.password).subscribe({
      next: (data) => {
        this.account=data,
        this.storageKey = `accountID_${this.account._id}`
        if(data.message){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
          return
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "Login successful!",
        }).then((result) => {
          if (result.isConfirmed) {
            this._auth.login(this.storageKey, this.account._id, this.accountName, this.password, this.loginStatus, this.rmbAccount)
            if(this.account.Type=='Admin'){
              window.location.href = 'http://localhost:4003/admin-management';
              return
            }
            this.router.navigate(['/home-page']);
          }
        });
       },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      }
    })
  }
}
