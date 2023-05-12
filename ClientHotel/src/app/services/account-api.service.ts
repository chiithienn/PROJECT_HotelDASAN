import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IAccount } from '../interface/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountAPIService {
  constructor(private _http: HttpClient) { }

  login(account:string,password:string):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'json',
    }
    const body={
      AccountName: account,
      Password: password
    }
    return this._http.post<any>("/users/login",body,requestOptions).pipe(
      map(res=>res as IAccount),
      retry(3),
      catchError(this.handleError)
    )
  }

  checkRegister(email:string,password:string,confirmPW:string):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'json',
    }
    const body={
      AccountName: email,
      Password: password,
      ConfirmPassword: confirmPW
    }
    return this._http.post<any>("/users/check-register",body,requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  register(body:any):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'json',
    }
    return this._http.post<any>("/users/register",body,requestOptions).pipe(
      map(res=>res as IAccount),
      retry(3),
      catchError(this.handleError)
    )
  }

  getInfoUser(accountId:any):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'json',
    }
    return this._http.post<any>("/users/user-detail",{ infoAccount: accountId },requestOptions).pipe(
      map(res=>res as IAccount),
      retry(3),
      catchError(this.handleError)
    )
  }

  forgetPassword(accountName: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type','application/json;charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    const body = {
      AccountName: accountName,
      NewPassword: newPassword,
      ConfirmNewPassword: confirmNewPassword
    };
    return this._http.patch<any>('/users/change-password', body, requestOptions).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    );
  }

  changePassword(body:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type','application/json;charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this._http.patch<any>('/users/change-password', body, requestOptions).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    );
  }

  updateInfo(body:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type','application/json;charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this._http.patch<any>('/users/update-account', body, requestOptions).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error:HttpErrorResponse){
    if(error.status===400){
      // return throwError (()=> new Error(error.error))
      return throwError(() => error).pipe(
        catchError((err) => {
          if (err.status === 400) {
            err = { ...err, responseType: 'text' };
          }
          return throwError(() => err.error);
        })
      );
    }
    return throwError (()=>new Error(error.message))
  }
}
