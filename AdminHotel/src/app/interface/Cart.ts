export interface ICartOrderDetail{
  _id:any,
  CartOrderID:any,
  Branch:string,
  RoomType:string,
  Price:number,
  RoomQuantity:number,
  Adults:number,
  Children:number,
  CheckInDate:string,
  CheckOutDate:string,
  TotalLine:number
}

export interface ICartOrder{
  _id:any,
  AccountID:any,
  DateCreated:string,
  TotalPrice:number,
  OrderDetails:Array<ICartOrderDetail>
}
