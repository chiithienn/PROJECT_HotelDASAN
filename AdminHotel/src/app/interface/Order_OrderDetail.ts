export interface IOrderDetail{
  _id:any,
  OrderID:any,
  Branch:string,
  RoomType:string,
  Price:number,
  Adults:number,
  Children:number,
  CheckInDate:string,
  CheckOutDate:string,
  TotalLine:number
}

export interface IOrders{
  _id:any,
  AccountID:any,
  DateCreated:string,
  FullName:string,
  PhoneNumber:string,
  Email:string,
  TotalPrice:number,
  OrderDetails:Array<IOrderDetail>
}
