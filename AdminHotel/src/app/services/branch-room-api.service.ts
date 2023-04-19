import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { IRoom, IBranch, IBranches } from '../interface/BranchRoom';
import { RoomHotel } from '../model/BranchRoom';

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
    return this._http.get<any>("/branches",requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    return throwError (()=>new Error(error.message))
  }

  getRoom(branchID:string, roomID:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/branches/"+branchID+"/rooms/"+roomID,requestOptions).pipe(
      map(res=>JSON.parse(res) as IBranches),
      retry(3),
      catchError(this.handleError)
    )
  }

  postFashion(aFashion:any):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.post<any>("/fashions",JSON.stringify(aFashion),requestOptions).pipe(
      map(res=>JSON.parse(res) as IBranches),
      retry(3),
      catchError(this.handleError)
    )
  }

  putRoom(aRoom:any,branchID:string,roomID:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.put<any>("/branches/"+branchID+"/rooms/"+roomID,JSON.stringify(aRoom),requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<RoomHotel>),
      retry(3),
      catchError(this.handleError)
    )
  }

  deleteFashion(fashionId:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.delete<any>("/fashions/"+fashionId,requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
  }
}
