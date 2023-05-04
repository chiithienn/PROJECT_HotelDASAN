import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IAccount } from '../interface/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountAPIService {
  constructor(private _http: HttpClient) { }

  getAccounts():Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    return this._http.get<any>("/users",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IAccount>),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    // if(error.status===400){
    //   return throwError (()=> new Error(error.error))
    // }
    return throwError (()=>new Error(error.message))
  }

  lockAccount(accountName:string,adminPassword:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    const body = {
      AccountName: accountName,
      AdminPassword: adminPassword
    }
    return this._http.put<any>("/users/lock-account",body,requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  unLockAccount(accountName:string,adminPassword:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    const body = {
      AccountName: accountName,
      AdminPassword: adminPassword
    }
    return this._http.put<any>("/users/unlock-account",body,requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  setValidAccounts(accountName: string[], adminPassword: string, valid: boolean): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json'
    };
    const body = {
      AccountNames: accountName,
      AdminPassword: adminPassword,
      Valid: valid
    };
    return this._http.put<any>('/users/lock-or-unlock-accounts', body, requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

}
