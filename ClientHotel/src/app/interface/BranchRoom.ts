export interface IBranches{
  _id:any,
  BranchName:string,
  HotelName:string,
  BranchCode:string,
  Description:string,
  BranchImage:string,
  HotelRoom:Array<IRoom>
}

export interface IBranch{
  _id:any,
  BranchName:string,
  HotelName:string,
  BranchCode:string,
  Description:string,
  BranchImage:string
}

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
  DateCreated:string,
  BookedDateRanges:[
    {
      CheckInDate:string,
      CheckOutDate:string
    }
  ]
  RoomImage:string,
}
