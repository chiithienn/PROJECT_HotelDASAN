export interface IBranches{
  _id:any,
  BranchName:string,
  HotelName:string,
  BranchCode:string,
  HotelRoom:Array<IRoom>
}

// export interface IBranch{
//   _id:any,
//   BranchName:string,
//   HotelName:string,
//   BranchCode:string
// }

export interface IRoom{
  _id:any,
  RoomNumber:string,
  RoomType:string,
  DefaultQty:number,
  Capacity:number,
  RoomPrice:number,
  AdultPrice:number,
  ChildrenPrice:number,
  RoomBranch:string,
  RoomDescription:string,
  RoomStatuzs:boolean,
  DateCreated:string,
  RoomImage:string,
}
