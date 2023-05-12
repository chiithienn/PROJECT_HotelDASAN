import { Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: '[app-sign-up]',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  account:any
  errMessage:string=''

  email:string="";
  password: string="";
  confirmPassword:string=''
  name=''
  phone=''
  DOB=''
  agreeTerm:boolean=false

  storageKey=''
  rmbAccount=false

  step1=true
  step2=false

  constructor(private _accService: AccountAPIService, private _authService: AuthService, private router: Router){}
  ngOnInit(): void {
  }

  changeAgree(){
    this.agreeTerm = !this.agreeTerm
  }

  nextStep(){
    this._accService.checkRegister(this.email, this.password, this.confirmPassword).subscribe({
      next: () => {
        this.step1 = false
        this.step2 = true
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

  checkAge(DOB: string): boolean {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

  register(){
    if (!this.checkAge(this.DOB)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "You must be at least 18 years old to create an account.",
      })
      return;
    }
    if (!this.agreeTerm) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "You must agree to our the terms & conditions to create an account.",
      })
      return;
    }

    const body = {
      AccountName: this.email,
      Password: this.password,
      ConfirmPassword: this.confirmPassword,
      FullName: this.name,
      PhoneNumber: this.phone,
      DOB: this.DOB,
      Avatar: ''
    }
    this._accService.register(body).subscribe({
      next: (data) => {
        this.account=data,
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "Account created successfully! Welcome " +data.FullName+ " to DASAN HOTEL",
        }).then((result) => {
          if (result.isConfirmed) {
            this.login();
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

  login() {
    this.storageKey = `accountID_${this.account._id}`;
    Swal.fire({
      title: 'Bạn có muốn lưu mật khẩu không?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rmbAccount = true;
      }
      this._authService.login(this.storageKey, this.account._id, this.email, this.password, true, this.rmbAccount)
      this.router.navigate(['/home-page']);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home-page') {
          location.reload();
        }
      });
    });
  }
}
