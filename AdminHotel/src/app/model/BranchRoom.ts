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
    public Capacity:number=0,
    public RoomPrice:number=0,
    public RoomBranch:string='',
    public RoomDescription:string='',
    public RoomStatus:boolean=true,
    public DateCreated:string='',
    public RoomImage:string=''
  ){}
}
