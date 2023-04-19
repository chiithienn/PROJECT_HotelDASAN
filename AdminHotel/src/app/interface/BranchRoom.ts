export interface IBranches{
  _id:any,
  BranchName:string,
  HotelName:string,
  BranchCode:string,
  HotelRoom:Array<IRoom>
}

export interface IBranch{
  _id:any,
  BranchName:string,
  HotelName:string,
  BranchCode:string
}

export interface IRoom{
  _id:any,
  RoomNumber:string,
  RoomType:string,
  Capacity:number,
  RoomPrice:number,
  RoomBranch:string,
  RoomDescription:string,
  RoomStatus:boolean,
  DateCreated:string,
  RoomImage:string,
}
