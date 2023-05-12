export class Order{
  constructor(
    public _id:any=null,
    public AccountID:any=null,
    public DateCreated:string='',
    public OrderDetails:Array<OrderDetail>
  ){}
}

export class OrderDetail{
  constructor(
    public _id:any=null,
    public OrderID:any=null,
    public Branch:string='',
    public RoomType:string='',
    public Price:number=0,
    public Adults:number=1,
    public Children:number=0,
    public CheckInDate:string='',
    public CheckOutDate:string='',
  ){}
}
