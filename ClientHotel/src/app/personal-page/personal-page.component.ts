import { Component, OnInit } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  accountID:any
  user:any

  password=''
  CurrentPassword=''
  NewPassword=''
  ConfirmNewPassword=''

  allowUpdate:boolean=true

  constructor(private _acc: AccountAPIService, private _auth: AuthService, private router: Router){ }

  ngOnInit(): void {
    this.accountID = this._auth.accountID
    this.getInfoUser()
  }

  getInfoUser(){
    if(this.accountID){
      this._acc.getInfoUser(this.accountID).subscribe({
        next: (data) => { this.user = data },
        error: (err) => { alert(err.message) }
      })
    }
  }

  updateInfo(){
    Swal.fire({
      title: 'Enter your password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        const body={
          accountID: this.accountID,
          Password: password,
          FullName: this.user.FullName,
          PhoneNumber: this.user.PhoneNumber,
          DOB: this.user.DOB,
          Avatar: this.user.Avatar
        }
        return this._acc.updateInfo(body).toPromise().then(response => {
          if (response.message) {
            Swal.fire({
              title: response.message,
              icon: 'success',
              timer: 1500,
              timerProgressBar: true,
            });
          }
        }).catch(err => {
          Swal.showValidationMessage(
            `Request failed: ${err.message}`
          );
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }

  changePassword(){
    const body={
      AccountName: this.user.AccountName,
      CurrentPassword: this.CurrentPassword,
      NewPassword: this.NewPassword,
      ConfirmNewPassword: this.ConfirmNewPassword
    }
    this._acc.changePassword(body).subscribe({
      next: (response) => {
        if(response.message){
          Swal.fire({
            icon: 'success',
            title: 'Thay đổi mật khẩu thành công',
            text: response.message,
          });
          return
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Thay đổi mật khẩu thất bại',
          text: err.message,
        });
      }
    })
  }

  async promptChangePassword() {
    const { value: formValues } = await Swal.fire({
      title: 'Thay đổi mật khẩu',
      html:
        '<input type="password" id="swal-input1" class="swal2-input" placeholder="Mật khẩu hiện tại">' +
        '<input type="password" id="swal-input2" class="swal2-input" placeholder="Mật khẩu mới">' +
        '<input type="password" id="swal-input3" class="swal2-input" placeholder="Xác nhận mật khẩu mới">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).value,
          (<HTMLInputElement>document.getElementById('swal-input3')).value,
        ]
      }
    })

    if (formValues) {
      const [currentPassword, newPassword, confirmNewPassword] = formValues;
      this.CurrentPassword = currentPassword;
      this.NewPassword = newPassword;
      this.ConfirmNewPassword = confirmNewPassword;
      this.changePassword();
    }
  }

  openUpdateInfo(){
    this.allowUpdate = false
  }

  openCartPage(){
    this.router.navigate(['/cart-page'])
  }
  openPersonalPage(){
    window.location.reload()
  }
  openOrderPage(){
    this.router.navigate(['/order-page'])
  }
  logout() {
    Swal.fire({
      title: 'Do you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._auth.logout();
        this.router.navigate(['/home-page']);
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home-page') {
            location.reload();
          }
        });
      }
    });
  }
}
