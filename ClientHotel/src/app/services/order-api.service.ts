import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { ICartOrder } from '../interface/Cart';
import { CartOrder } from '../model/Cart';
import { IOrders } from '../interface/Order_OrderDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderAPIService {
  constructor(private _http: HttpClient) { }

  addCart(accountID: string, cartDetails: any[]):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    const body = {
      AccountID: accountID,
      CartDetails: cartDetails
    };
    return this._http.post<any>("/carts",body,requestOptions).pipe(
      map(res=>JSON.parse(res) as CartOrder),
      retry(3),
      catchError(this.handleError)
    )
  }

  getCarts():Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/carts",requestOptions).pipe(
      map(res=>JSON.parse(res) as ICartOrder),
      retry(3),
      catchError(this.handleError)
    )
  }

  deleteCartDetail(cartDetailID:any):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text",
      body:{cartDetailID: cartDetailID}
    }
    return this._http.delete<any>("/carts/cart-detail",requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  createOrder(cartID:any):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    const body = {
      cartId: cartID
    };
    return this._http.post<any>("/carts/update-cart-to-order",body,requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  getOrders():Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/orders",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IOrders>),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    return throwError (()=>new Error(error.message))
  }
}
