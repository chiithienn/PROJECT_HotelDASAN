export interface ICartOrderDetail{
  _id:any,
  RoomID:string,
  CartID:any,
  Branch:string,
  RoomType:string,
  Price:number,
  Adults:number,
  Children:number,
  Capacity:number,
  CheckInDate:string,
  CheckOutDate:string,
  TotalLine:number
}

export interface ICartOrder{
  _id:any,
  AccountID:any,
  DateCreated:string,
  FullName:string,
  PhoneNumber:string,
  Email:string,
  TotalPrice:number,
  CartDetails:Array<ICartOrderDetail>
}
