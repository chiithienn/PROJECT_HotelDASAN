export class BranchHotel{
  constructor(
    public _id:any=null,
    public Branch:string='',
    public HotelName:string='',
    public BranchCode:string=''
  ){}
}
export class RoomHotel{
  constructor(
    public _id:any=null,
    public RoomNumber:string='',
    public RoomType:string='',
    public DefaultQty:number=2,
    public Capacity:number=2,
    public RoomPrice:number=500000,
    public AdultPrice:number=200000,
    public ChildrenPrice:number=100000,
    public RoomBranch:string='',
    public RoomDescription:string='',
    public RoomStatus:boolean=true,
    public DateCreated:string='',
    public RoomImage:string=''
  ){}
}
