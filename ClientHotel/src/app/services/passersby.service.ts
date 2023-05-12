import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PassersbyService {
  isLoggedIn = false;
  accountID: any;
  isPersistentStorage = false;
  loginStatus=true
  userName = '';
  password = '';
  storageKey=''

  constructor() {
    this.storageKey = localStorage.getItem('storageKey') || '';
    const storedAccountID = localStorage.getItem(this.storageKey);
    if (storedAccountID) {
      const data = JSON.parse(storedAccountID);
      if(data.expiration==null){
        this.isLoggedIn = true;
        // this.isPersistentStorage = true;
        data.loginStatus ? (this.isPersistentStorage = true) : (this.isPersistentStorage = false)
        this.accountID = data.accountID;
        this.userName = data.username;
      }else{
        if (new Date(data.expiration) < new Date()) {
          this.logout()
        }
        if (new Date(data.expiration) > new Date())  {
          this.isLoggedIn = true;
          this.isPersistentStorage = false;
          this.accountID = data.accountID;
          this.userName = data.username; // Lấy giá trị của username từ localStorage
        }
      }
    }
  }

  login(storagekey:string, accountID: any, userName:string, password:string, loginStatus:boolean=true, isPersistentStorage: boolean = false) {
    this.isLoggedIn = true;
    this.accountID = accountID;
    this.userName = userName;
    this.password = password

    this.storageKey = storagekey;
    localStorage.setItem('storageKey', this.storageKey);
    if (!isPersistentStorage) {
      const expiration = moment();
      expiration.add(30, 'minutes');
      localStorage.setItem(this.storageKey, JSON.stringify({ accountID, userName, loginStatus, expiration }));
    } else {
      localStorage.setItem(this.storageKey, JSON.stringify({ accountID, userName, password, loginStatus }));
    }

    this.isPersistentStorage = isPersistentStorage; // Lưu biến định danh
  }

  logout() {
    this.isLoggedIn = false;

    if(this.isPersistentStorage){
      const storedAccountID = localStorage.getItem(`accountID_${this.accountID}`);
      if (storedAccountID) {
        const data = JSON.parse(storedAccountID);
        localStorage.setItem(`accountID_${this.accountID}`, JSON.stringify({ accountID: null, userName: data.userName, loginStatus: false }));
      }
    }else{
      localStorage.removeItem(`accountID_${this.accountID}`);
      localStorage.removeItem('storageKey');
    }

    this.isPersistentStorage = false; // Thiết lập lại biến định danh
  }
}
