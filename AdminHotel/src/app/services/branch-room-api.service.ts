import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { IRoom, IBranches } from '../interface/BranchRoom';
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

  getBranch(branchID:string):Observable<any>{
    const headers =  new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType: 'text'
    }
    return this._http.get<any>("/branches/"+branchID,requestOptions).pipe(
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

  postRoom(aRoom:any,branchID:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.post<any>("/branches/"+branchID+"/rooms",JSON.stringify(aRoom),requestOptions).pipe(
      map(res=>JSON.parse(res) as RoomHotel),
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

  deleteRoom(branchID:string,roomID:string):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.delete<any>("/branches/"+branchID+"/rooms/"+roomID,requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
  }

  deleteRooms(branchID:string,roomIds: string[]):Observable<any>{
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      body: JSON.stringify({roomIds: roomIds}),
      responseType:"json"
    }
    return this._http.delete<any>("/branches/"+branchID+"/rooms",requestOptions).pipe(
      map(res=>res as Array<IBranches>),
      retry(3),
      catchError(this.handleError)
    )
}

}
