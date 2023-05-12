import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: '[app-forget-pw]',
  templateUrl: './forget-pw.component.html',
  styleUrls: ['./forget-pw.component.css']
})
export class ForgetPWComponent implements AfterViewInit, OnInit{
  infoToFind:string=''
  user:any
  errMessage:string=''

  showConfirmAccount:boolean=false
  dataLoaded:boolean=false
  showConfirmCode:boolean=false
  showChangePW:boolean=false

  countdown: number = 60;
  interval: any;

  code=''
  correctCode='20406'
  incorrectStatus=false

  storageKey=''
  rmbAccount=false
  newPW=''
  confirmPW=''

  constructor(private _accService: AccountAPIService, private _authService: AuthService, private router: Router){}

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {

  }

  findAccount(){
    this._accService.getInfoUser(this.infoToFind).subscribe({
      next: (data) => {
        this.user=data
        if(!this.user){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Account not found!",
          })
          return
        }
        this.showConfirmAccount = true
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

  confirmAccount(){
    this.dataLoaded = true
    this.showConfirmCode = false
    this.code=''
    clearInterval(this.interval);
    setTimeout(() => {
      this.dataLoaded = false;
      this.showConfirmAccount = false
      this.showConfirmCode = true;
      this.startCountdown()
    }, 4000);
  }

  reSendCode(){
    this.dataLoaded = true
    this.showConfirmCode = false
    this.incorrectStatus=false
    this.code=''
    clearInterval(this.interval);
    setTimeout(() => {
      this.dataLoaded = false;
      this.showConfirmCode = true;
      this.startCountdown()
    }, 4000);
  }

  confirmCode(){
    this.dataLoaded = true
    this.showConfirmCode=false
    if(this.code!==this.correctCode){
      this.dataLoaded = true
      this.incorrectStatus=true
      clearInterval(this.interval);
      setTimeout(() => {
        this.dataLoaded = false;
        this.showConfirmCode = true;
        this.startCountdown()
      }, 2000);
      return
    }
    clearInterval(this.interval);
    setTimeout(() => {
      this.dataLoaded = false;
      this.showChangePW = true;
    }, 2000);
  }

  startCountdown() {
    this.countdown=60
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  cancelConfirm(){
    this.showConfirmCode = false
    this.showChangePW = false
    this.showConfirmAccount = true
    this.incorrectStatus=false
  }

  closeModalConfirm(){
    this.showChangePW = false
    this.showConfirmAccount = false
  }

  changePW(){
    this._accService.forgetPassword(this.user.AccountName, this.newPW, this.confirmPW).subscribe({
      next: (response) => {
        if (response.message) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message,
          }).then((result) => {
            if (result.isConfirmed) {
              this.login();
            }
          });
        }
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
    this.storageKey = `accountID_${this.user._id}`;
    Swal.fire({
      title: 'Bạn có muốn lưu mật khẩu không?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rmbAccount = true;
      }
      this._authService.login(this.storageKey, this.user._id, this.user.AccountName, this.newPW, true, this.rmbAccount)
      this.router.navigate(['/home-page']);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home-page') {
          location.reload();
        }
      });
    });
  }
}
