export class CartOrder{
  constructor(
    public _id:any=null,
    public AccountID:string='',
    public DateCreated:string='',
    public OrderDetails:Array<CartOrderDetail>
  ){}
}

export class CartOrderDetail{
  constructor(
    public _id:any=null,
    public RoomID:string='',
    public Branch:string='',
    public RoomType:string='',
    public Price:number=0,
    public Adults:number=1,
    public Children:number=0,
    public CheckInDate:string='',
    public CheckOutDate:string='',
    public CartID:any=null
  ){}
}
