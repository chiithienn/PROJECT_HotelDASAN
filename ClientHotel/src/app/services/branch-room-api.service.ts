import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IBranch, IBranches, IRoom } from '../interface/BranchRoom';

@Injectable({
  providedIn: 'root'
})
export class BranchRoomAPIService {
  constructor(private _http: HttpClient) { }

  getBranches():Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    return this._http.get<any>("/branches/only",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranch>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getBranch(branchCode:string, adults:number, children:number, checkInDate:string, checkOutDate:string):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    const body = {
      branchCode: branchCode,
      adults: adults,
      children: children,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate
    };
    return this._http.post<any>("/branches/rooms/not-booked",body,requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getRoomOfBranch(branchID:any):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    return this._http.get<any>("/branches/"+branchID+"/rooms",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getRoom(branchID:string, roomID:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/branches/"+branchID+"/rooms/"+roomID,requestOptions).pipe(
      map(res=>JSON.parse(res) as IRoom),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    return throwError (()=>new Error(error.message))
  }
}
