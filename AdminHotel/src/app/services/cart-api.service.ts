import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { ICartOrder } from '../interface/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartAPIService {
  constructor(private _http: HttpClient) { }

  getCarts():Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    return this._http.get<any>("/carts",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<ICartOrder>),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    return throwError (()=>new Error(error.message))
  }
}
