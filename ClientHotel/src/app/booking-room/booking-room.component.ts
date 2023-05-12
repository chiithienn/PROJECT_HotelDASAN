import { Component, OnInit } from '@angular/core';
import { addDays, format } from 'date-fns';
import Swal from 'sweetalert2';
import { BranchRoomAPIService } from '../services/branch-room-api.service';
import { Order } from '../model/Order_OrderDetail';
import { enUS } from 'date-fns/locale';
import { OrderAPIService } from '../services/order-api.service';
import { CartOrder, CartOrderDetail } from '../model/Cart';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrls: ['./booking-room.component.css']
})
export class BookingRoomComponent implements OnInit {
  branches:any
  abranch:any
  errMessage:string=''

  showLoad:boolean=true
  showModal:boolean=false
  showModalFacilities:boolean=false
  showModalTerm:boolean=false

  selectedBranch='Hồ Chí Minh';
  selectedBranchCode='HCM'
  totalPrice=0

  roomSelected:any
  roomQuantityOptions: any[] = [];
  selectedRoomQuantity: number = 0;
  selectedAdults: number = 1;
  selectedChildren: number = 0;
  adultsOptions: any[] = [];
  childrenOptions: any[] = [];

  // todayString: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  checkInDate: string = format(new Date(), 'yyyy-MM-dd', { locale: enUS });
  checkOutDate: string = format(addDays(new Date(this.checkInDate), 1), 'yyyy-MM-dd', { locale: enUS });

  // newCart = new CartOrder(null,'','',[])
  cart:any
  aCart:any
  accountID = ''
  showCartDetail=true
  cartDetails=[
    {
      RoomID: '',
      Branch: "",
      RoomType: "",
      Price: 0,
      Adults: 1,
      Children: 0,
      Capacity:2,
      CheckInDate: "",
      CheckOutDate: ""
    }
  ]

  constructor(
    private _service: BranchRoomAPIService,
    private _s: OrderAPIService,
    private _auth: AuthService,
    private router: Router,
  ){ }

  ngOnInit(): void {
    this._service.getBranches().subscribe({
      next: (data) => {
        this.branches=data,
        this.accountID = this._auth.accountID;
        this.showLoad=false
        this.callGetCartAPI();
        this.callGetBranchAPI();
       },
      error: (err) => { this.errMessage=err.message }
    })
  }

  viewFacilities(){
    this.showModalFacilities = true
  }
  viewTerm(){
    this.showModalTerm = true
  }

  callGetBranchAPI() {
    this._service.getBranch(this.selectedBranchCode, this.selectedAdults, this.selectedChildren, this.checkInDate, this.checkOutDate).subscribe({
      next: (data) => {
        this.abranch=data;
      },
      error: (err) => { this.errMessage=err.message }
    })
  }

  onChange() {
    this.selectedAdults = (+this.selectedAdults);
    this.selectedChildren = (+this.selectedChildren);
    this.callGetBranchAPI()
  }
  changeNumPeople(){
    this.cartDetails=[
      {
        RoomID: this.roomSelected._id,
        Branch: this.selectedBranch,
        RoomType: this.roomSelected.RoomType,
        Price: this.roomSelected.RoomPrice,
        Adults: this.roomSelected.Adults,
        Children: this.roomSelected.Children,
        Capacity: this.roomSelected.Capacity,
        CheckInDate: this.checkInDate,
        CheckOutDate: this.checkOutDate
      }
    ]
  }

  addToCart(){
    this._s.addCart(this.accountID,this.cartDetails).subscribe({
      next: (data) => {
        this.aCart=data,
        this.callGetCartAPI()
       },
      error: (err) => { this.errMessage=err.message }
    })
  }

  // hiddenDetail(){
  //   this.showCartDetail = false
  // }

  deleteCartDetail(cartDetailID:any){
    this._s.deleteCartDetail(cartDetailID).subscribe({
      next: () => {
        this.callGetCartAPI()
      },
      error: (err) => { this.errMessage=err.message }
    })
  }

  bookRoom(cartID:any){
    if (this.cart.CartDetails.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Cart is empty! Please add items to the cart before booking.',
      })
      return;
    }
    this.router.navigate(['/payment-page']);
  }

  callGetCartAPI(){
    this._s.getCarts().subscribe({
      next: (data) => {
        // this.cart=data
        this.cart = data.find((cart:any) => cart.AccountID === this.accountID);
       },
      error: (err) => { this.errMessage=err.message }
    })
  }

  changeBranch(branchName:string, branchCode:string){
    this.selectedBranch = branchName;
    this.selectedBranchCode = branchCode
    this.callGetBranchAPI()
  }

  closeModal(){
    this.showModal=false
  }
  closeModalFacilities(){
    this.showModalFacilities = false
  }
  closeModalTerm(){
    this.showModalTerm = false
  }

  popUp(branchID:any, roomType:string){
    this.showModal=true;
    this._service.getRoomOfBranch(branchID).subscribe({
      next: (data) => {
        // this.roomSelected = data.find((room:any) => room.RoomType === roomType);

        this.roomSelected={
          ...data.find((room:any) => room.RoomType === roomType),
          Adults:1,
          Children:0
        }

        this.cartDetails=[
          {
            RoomID: this.roomSelected._id,
            Branch: this.selectedBranch,
            RoomType: this.roomSelected.RoomType,
            Price: this.roomSelected.RoomPrice,
            Adults: this.roomSelected.Adults,
            Children: this.roomSelected.Children,
            Capacity: this.roomSelected.Capacity,
            CheckInDate: this.checkInDate,
            CheckOutDate: this.checkOutDate
          }
        ]

        // Lấy danh sách các phòng có RoomType giống với roomSelected.RoomType và RoomStatus là true
        const rooms = data.filter((room:any) => room.RoomType === this.roomSelected.RoomType);

        // Đếm số lượng phòng
        const roomCount = rooms.length;

        // Tạo danh sách các option cho select RoomQuantity
        const options = [];
        for(let i=1; i<=roomCount; i++){
          options.push(i);
        }
        this.roomQuantityOptions = options;

        // Tạo danh sách các option cho select Adults
        const adultsOptions = [];
        const adultsMin = 1;
        const adultsMax = this.roomSelected.Capacity;
        for(let i=adultsMin; i<=adultsMax; i++){
          adultsOptions.push(i);
        }
        this.adultsOptions = adultsOptions;

        // Tạo danh sách các option cho select Children
        const childrenOptions = [];
        const childrenMin = 0;
        const childrenMax = this.roomSelected.Capacity - 1;
        for(let i=childrenMin; i<=childrenMax; i++){
          childrenOptions.push(i);
        }
        this.childrenOptions = childrenOptions;
      },
      error: (err) => { this.errMessage=err.message }
    })
  }

  getRange(num: number): number[] {
    return Array.from({length: num}, (_, i) => i + 1);
  }
}
