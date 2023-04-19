export interface IOrderDetail{
  _id:any,
  OrderID:any,
  Branch:string,
  RoomType:string,
  RoomQuantity:number,
  Adults:number,
  Children:number,
  CheckInDate:string,
  CheckOutDate:string
}

export interface IOrder{
  _id:any,
  AccountID:any,
  DateCreated:string
}
