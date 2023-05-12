import { Component } from '@angular/core';
import { AccountAPIService } from '../services/account-api.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent {
  accounts:any
  errMessage:string=''

  selectedAccountID:string=''
  accountName:string=''
  valid:boolean=true
  adminPassword=''
  adminPasswordConfirm=''

  showDetailAccount=false
  showLockAccount=false
  showSetValidAccounts=false

  accountNames: string[] = [];
  AccountName: string[] = [];

  anAccount=true
  multiAccount=false

  constructor(private _service: AccountAPIService){
    this._service.getAccounts().subscribe({
      next:(data)=>{this.accounts=data},
      error: (err)=> {this.errMessage=err}
    })
  }

  openDetailAccount(accountID:string){
    this.selectedAccountID = accountID
    this.showDetailAccount=true
  }
  openLockAccount(accountName:string, valid:boolean){
    this.showLockAccount=true
    this.accountName = accountName
    this.valid = valid
  }
  openSetValidAccounts(){
    if (this.accountNames.length === 0) {
      alert("Vui lòng chọn ít nhất một account để set valid.");
      return;
    }
    this.showSetValidAccounts=true
  }

  closeModalDetail(showDetailAccount: boolean){
    this.showDetailAccount = showDetailAccount
  }
  closeModalLock(){
    this.showLockAccount=false
  }
  closeModalSetValid(){
    this.showSetValidAccounts=false
  }

  toggleAccountId(accountName: string) {
    if (this.accountNames.includes(accountName)) {
      this.accountNames.splice(this.accountNames.indexOf(accountName), 1);
    } else {
      this.accountNames.push(accountName);
    }
  }

  setValidAccounts(valid:boolean,type:boolean) {
    if (this.adminPassword !== this.adminPasswordConfirm) {
      alert("Passwords do not match");
      return;
    }
    if(type){
      const confirmed = confirm(`Are you sure you want ${valid ? 'UNLOCK' : 'LOCK'} this account?`);
      if(confirmed){
        this.AccountName.push(this.accountName);
        this._service.setValidAccounts(this.AccountName,this.adminPassword,valid).subscribe({
          next: (response) => {
            alert(response.message);
            location.reload();
          },
          error: (err) => {
            (err.message=='Incorrect password') ? alert(err.message) : this.errMessage=err.message
          }
        });
      }
    } else{
      const confirmed = confirm(`Are you sure you want ${valid ? 'UNLOCK' : 'LOCK'} this/these account(s)?`);
      if(confirmed){
        this._service.setValidAccounts(this.accountNames,this.adminPassword,valid).subscribe({
          next: (response) => {
            alert(response.message);
            location.reload();
          },
          error: (err) => {
            (err.message=='Incorrect password') ? alert(err.message) : this.errMessage=err.message
          }
        });
      }
    }
  }
}
