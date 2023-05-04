const express = require("express")
const app = express()
const port = 4005

const morgan = require("morgan")
app.use(morgan("combined"))

const bodyParser=require("body-parser")
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(express.json());

const cors =  require("cors")
app.use(cors())

const moment = require('moment');

app.listen(port,()=>{
    console.log(`My server listening on port ${port}`)
})

app.get("/",(req, res)=>{
    res.send("This Web server is processed for MongoDB")
})

const { MongoClient, ObjectId } = require('mongodb')
const { error } = require("console")
client = new  MongoClient("mongodb://127.0.0.1:27017")
client.connect()
database = client.db("TestData")
orderCollection = database.collection("Order")
orderDetailCollection = database.collection("OrderDetail")
branchCollection = database.collection("BranchHotel")
roomCollection = database.collection("RoomHotel")
cartCollection = database.collection("CartOrder")
cartDetailCollection = database.collection("CartOrderDetail")
accountCollection = database.collection("Account")

// =====================================================
// ---------------------- ORDER - ORDER DETAIL ----------------------
// =====================================================


// Lấy ra toàn bộ order và các order detail của nó
// app.get("/orders", cors(), async (req, res) => {
//   try {
//     const orders = await orderCollection.aggregate([
//       {
//         $lookup: {
//           from: "OrderDetail",
//           localField: "_id",
//           foreignField: "OrderID",
//           as: "OrderDetails",
//         },
//       },
//     ]).toArray();
    
//     res.send(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/orders", cors(), async (req, res) => {
  try {
    const orders = await orderCollection.find({}).toArray();
    const orderDetails = await orderDetailCollection.find({}).toArray();
    const rooms = await roomCollection.find({}).toArray();

    // Tạo một đối tượng mới chứa thông tin các order và order detail của chúng
    const result = await Promise.all(orders.map(async (order) => {
      const orderDetailItems = orderDetails
        .filter((orderDetail) => orderDetail.OrderID.toString() === order._id.toString())
        .map((orderDetail) => {
          const room = rooms.find((room) => room.RoomType === orderDetail.RoomType);
          const totalLine = calculateTotalPrice(orderDetail, room, orderDetail.CheckInDate, orderDetail.CheckOutDate);
          return {
            ...orderDetail,
            TotalLine: totalLine,
          };
        });

      const totalPrice = orderDetailItems.reduce((sum, orderDetailItem) => sum + orderDetailItem.TotalLine, 0);
      const account = await accountCollection.findOne({ _id: order.AccountID });
      return {
        ...order,
        FullName: account.FullName,
        PhoneNumber: account.PhoneNumber,
        Email: account.Email,
        TotalPrice: totalPrice,
        OrderDetails: orderDetailItems,
      };
    }));

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/carts", cors(), async (req, res) => {
  try {
    const carts = await cartCollection.find({}).toArray();
    const cartDetails = await cartDetailCollection.find({}).toArray();
    const rooms = await roomCollection.find({}).toArray();

    // Tạo một đối tượng mới chứa thông tin các order và order detail của chúng
    const result = await Promise.all(carts.map(async (cart) => {
      const cartDetailItems = cartDetails
        .filter((cartDetail) => cartDetail.CartOrderID.toString() === cart._id.toString())
        .map((cartDetail) => {
          const room = rooms.find((room) => room.RoomType === cartDetail.RoomType);
          const totalLine = calculateTotalPrice(cartDetail, room, cartDetail.CheckInDate, cartDetail.CheckOutDate);
          return {
            ...cartDetail,
            TotalLine: totalLine,
          };
        });

      const totalPrice = cartDetailItems.reduce((sum, cartDetailItem) => sum + cartDetailItem.TotalLine, 0);
      const account = await accountCollection.findOne({ _id: cart.AccountID });
      return {
        ...cart,
        FullName: account.FullName,
        PhoneNumber: account.PhoneNumber,
        Email: account.Email,
        TotalPrice: totalPrice,
        CartDetails: cartDetailItems,
      };
    }));

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function calculateTotalPrice(orderDetail, room, checkInDate, checkOutDate) {
  const { Adults, Children, Price } = orderDetail;
  const { DefaultQty, AdultPrice, ChildrenPrice } = room;

  const checkInDateObj = new Date(checkInDate);
  const checkOutDateObj = new Date(checkOutDate);

  const numDays = Math.ceil((checkOutDateObj - checkInDateObj) / (1000 * 60 * 60 * 24));


  const checkCapacity = DefaultQty - (Adults + Children);
  if (checkCapacity >= 0) {
    return Price * numDays;
  } else if (checkCapacity < 0 && DefaultQty - Adults >= 0) {
    return (Price + Children * ChildrenPrice) * numDays;
  } else {
    return (Price + Children * ChildrenPrice + (Adults - DefaultQty) * AdultPrice) * numDays;
  }
}

app.post("/update-cart-to-order", cors(), async (req, res) => {
  const cartId = req.body.cartId;
  const status = req.body.Status;
  if(status!==true){
    return res.status(400).json({ message: "Cart is not ready for update to order" });
  }
  const cart = await cartCollection.findOne({_id: new ObjectId(cartId)});
  const cartDetails = await cartDetailCollection.find({ CartOrderID: cart._id }).toArray();

  const order = {
    _id: cart._id,
    AccountID: cart.AccountID,
    DateCreated: cart.DateCreated
  };

  const OrderDetails = [];
  cartDetails.forEach((cartDetail) => {
    const orderDetail = {
      OrderID: cartDetail.CartOrderID,
      Branch: cartDetail.Branch,
      RoomType: cartDetail.RoomType,
      Price: cartDetail.Price,
      RoomQuantity: cartDetail.RoomQuantity,
      Adults: cartDetail.Adults,
      Children: cartDetail.Children,
      CheckInDate: cartDetail.CheckInDate,
      CheckOutDate: cartDetail.CheckOutDate,
    };
    OrderDetails.push(orderDetail);
  });

  const newOrders = await orderCollection.insertOne(order);
  const newOrderDetails = await orderDetailCollection.insertMany(OrderDetails);

  await cartCollection.deleteOne({ _id: cart._id });
  await cartDetailCollection.deleteMany({ CartOrderID: cart._id });

  res.status(200).json({ message: "Checkout success" });
});

// =====================================================
// ---------------------- BRANCH - ROOM ----------------------
// =====================================================

// Lấy all rooms của all branchs
app.get("/branches", cors(), async (req, res) => {
    try {
      const branches = await branchCollection.find({}).toArray();
      const rooms = await roomCollection.find({}).toArray();
  
      // Tạo một đối tượng mới chứa thông tin các chi nhánh và phòng của chúng
      const result = branches.map((branch) => ({
        _id: branch._id,
        BranchName: branch.BranchName,
        HotelName: branch.HotelName,
        BranchCode: branch.BranchCode,
        HotelRoom: rooms.filter((room) => room.RoomBranch === branch.BranchCode),
      }));
  
    res.send(result)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
});

// Lấy ra một branch theo _id
app.get("/branches/:branchId", cors(), async (req, res) => {
    const branchId = new ObjectId(req.params["branchId"]);

    const branch = await branchCollection.findOne({ _id: branchId });
    const rooms = await roomCollection.find({ RoomBranch: branch.BranchCode }).toArray();
    
    const result = {
      _id: branch._id,
      BranchName: branch.BranchName,
      HotelName: branch.HotelName,
      HotelRoom: rooms,
    };

    res.send(result)
});

// Lấy all rooms của 1 branch
app.get("/branches/:branchId/rooms", cors(), async (req, res) => {
    const branchId = new ObjectId(req.params["branchId"]);

    const branch = await branchCollection.findOne({ _id: branchId });
    const rooms = await roomCollection.find({ RoomBranch: branch.BranchCode }).toArray();

    res.send(rooms)
});

// Lấy ra một phòng cụ thể
app.get("/branches/:branchId/rooms/:roomId", cors(), async (req, res) => {
    const branchId = new ObjectId(req.params["branchId"]);
    const roomId = new ObjectId(req.params["roomId"]);
    // Tìm chi nhánh theo _id được chỉ định
    const branch = await branchCollection.findOne({ _id: branchId });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    // Tìm phòng theo _id được chỉ định và thuộc về chi nhánh đó
    const room = await roomCollection.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Trả về kết quả
    res.send(room);
});

// Tạo 1 phòng cho 1 branch
app.post("/branches/:branchId/rooms", cors(), async (req, res) => {
  const date_created = moment().format('YYYY-MM-DD');

  const branchId = new ObjectId(req.params["branchId"]);
  const { RoomNumber, RoomType, Capacity, RoomPrice, RoomDescription, RoomStatus, RoomImage } = req.body;
  const branch = await branchCollection.findOne({ _id: branchId });

  // Tạo một đối tượng phòng mới
  const newRoom = {
    RoomNumber,
    RoomType,
    Capacity,
    RoomPrice,
    RoomBranch: branch.BranchCode,
    RoomDescription,
    RoomStatus,
    DateCreated: date_created,
    RoomImage
  };

  await roomCollection.insertOne(newRoom);
  res.send(newRoom);
});

// Cập nhật thông tin của một phòng cụ thể
app.put("/branches/:branchId/rooms/:roomId", cors(), async (req, res) => {
  const branchId = new ObjectId(req.params["branchId"]);
  const roomId = new ObjectId(req.params["roomId"]);

  // Tìm chi nhánh theo _id được chỉ định
  const branch = await branchCollection.findOne({ _id: branchId });
  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }

  // Tìm phòng theo _id được chỉ định và thuộc về chi nhánh đó
  const room = await roomCollection.findOne({ _id: roomId, RoomBranch: branch.BranchCode });
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  // Cập nhật thông tin phòng với các thuộc tính mới
  const { RoomNumber, RoomType, Capacity, RoomPrice, RoomDescription, RoomStatus, RoomImage, RoomBranch } = req.body;
  const updatedRoom = {
    ...room,
    RoomNumber,
    RoomType,
    Capacity,
    RoomPrice,
    RoomBranch,
    RoomDescription,
    RoomStatus,
    RoomImage,
  };

  await roomCollection.updateOne({ _id: roomId }, { $set: updatedRoom });
  res.send(updatedRoom);
});

// Xoá 1 room của 1 branch
app.delete("/branches/:branchId/rooms/:roomId", cors(), async (req, res) => {
  const branchId = new ObjectId(req.params["branchId"]);
  const roomId = new ObjectId(req.params["roomId"]);
  // Tìm chi nhánh theo _id được chỉ định
  const branch = await branchCollection.findOne({ _id: branchId });
  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }
  // Tìm phòng theo _id được chỉ định và thuộc về chi nhánh đó
  const room = await roomCollection.findOne({ _id: roomId, RoomBranch: branch.BranchCode });
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  // Xoá phòng
  await roomCollection.deleteOne({ _id: roomId, RoomBranch: branch.BranchCode });
  // Trả về thông tin phòng đã xoá
  // res.send("Đã xoá phòng thành công!");
  res.send(room);
});

// Xoá nhiều phòng của 1 chi nhánh
app.delete("/branches/:branchId/rooms", cors(), async (req, res) => {
  const branchId = new ObjectId(req.params["branchId"]);
  const roomIds = req.body.roomIds.map((id) => new ObjectId(id));
  // Tìm chi nhánh theo _id được chỉ định
  const branch = await branchCollection.findOne({ _id: branchId });
  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }
  // Tìm các phòng thuộc chi nhánh đó có trong danh sách roomIds
  const rooms = await roomCollection.find({ _id: { $in: roomIds }, RoomBranch: branch.BranchCode }).toArray();
  if (rooms.length === 0) {
    return res.status(404).json({ message: "Rooms not found" });
  }
  // Xoá các phòng thuộc danh sách roomIds
  await roomCollection.deleteMany({ _id: { $in: roomIds }, RoomBranch: branch.BranchCode });
  // Trả về thông tin các phòng đã xoá
  res.send(rooms);
});

// =====================================================
// ---------------------- ACCOUNT ----------------------
// =====================================================

app.get("/users",cors(),async(req, res)=>{
  accountCollection = database.collection("Account")
  const accounts = await accountCollection.find({Type:"Customer"}).toArray();
  res.send(accounts)
})

// app.get("/users/user-detail",cors(),async(req, res)=>{
//   const accountID = new ObjectId(req.body._id);
//   accountCollection = database.collection("Account")
//   const account = await accountCollection.findOne({_id:accountID});
//   res.send(account)
// })

app.post("/register",cors(),async(req,res)=>{
  try {
    var crypto = require('crypto')
    salt = crypto.randomBytes(16).toString('hex')
    const date_created = moment().format('YYYY-MM-DD');

    accountCollection = database.collection("Account")
    account=req.body

    const existingAccount = await accountCollection.findOne({ AccountName: account.AccountName });
    if (existingAccount) {
      res.status(400).send({ message: "AccountName already exists" });
      return;
    }

    if(account.Password !== account.ConfirmPassword){
      res.status(400).send({ message: "Passwords do not match" });
      return;
    }

    hash = crypto.pbkdf2Sync(account.Password, salt, 1000, 64, `sha512`).toString(`hex`)

    account.Password = hash
    account.DateCreated = date_created
    account.Valid = true
    account.salt = salt

    if (account.AdminCode === "DASANK20406") {
      account.Type = "Admin";
    } else {
      account.Type = "Customer";
    }
    //  else {
    //   res.status(400).send({ message: "Code not correct" });
    //   return;
    // }

    delete account.AdminCode;
    delete account.ConfirmPassword;

    await accountCollection.insertOne(account)

    res.send(req.body)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.post("/login",cors(),async (req,res)=>{
  try {
    AccountName=req.body.AccountName
    Password=req.body.Password

    var crypto = require("crypto")

    accountCollection = database.collection("Account")
    account = await accountCollection.findOne({AccountName:AccountName})
    if(account==null){
      res.send({"AccountName":AccountName,"message":"Account not exist"})
    } else if(!account.Valid){
      res.status(400).send({ message: "Account is not valid" });
      return;
    } else{
      hash = crypto.pbkdf2Sync(Password, account.salt, 1000, 64, `sha512`).toString(`hex`)
      if(account.Password==hash){
        res.send(account)
      } else{
        res.send({"AccountName":AccountName, "Password":Password, "message":"wrong password"})
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.patch('/users/change-password', cors(), async (req, res) => {
  try {
    const accountName = req.body.AccountName;
    const currentPassword = req.body.CurrentPassword;
    const newPassword = req.body.NewPassword;
    const confirmNewPassword = req.body.ConfirmNewPassword;

    // Check if both new passwords match
    if (newPassword !== confirmNewPassword) {
      res.status(400).send({ message: 'New passwords do not match' });
      return;
    }

    // Find the account in the database
    const accountCollection = database.collection('Account');
    const account = await accountCollection.findOne({ AccountName: accountName });

    // Check if the current password is correct
    const crypto = require('crypto');
    const hash = crypto.pbkdf2Sync(currentPassword, account.salt, 1000, 64, 'sha512').toString('hex');
    if (hash !== account.Password) {
      res.status(400).send({ message: 'Incorrect current password' });
      return;
    }

    // Update the password in the database
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, 'sha512').toString('hex');
    await accountCollection.updateOne({ AccountName: accountName }, { $set: { Password: newHash, salt: newSalt } });

    res.send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put('/users/lock-account', cors(), async (req, res) => {
  try {
    const accountName = req.body.AccountName;
    // const adminAccountName = req.body.AdminAccountName;
    const adminPassword = req.body.AdminPassword;

    // Check if the admin credentials are correct
    const adminCollection = database.collection('Account');
    const adminAccount = await adminCollection.findOne({ Type: 'Admin' });

    if (!adminAccount) {
      res.status(400).send({ message: 'Invalid admin credentials' });
      return;
    }

    const crypto = require('crypto');
    const hash = crypto.pbkdf2Sync(adminPassword, adminAccount.salt, 1000, 64, 'sha512').toString('hex');
    if (hash !== adminAccount.Password) {
      res.status(400).send({ message: 'Incorrect password' });
      return;
    }

    // Find the account in the database
    const accountCollection = database.collection('Account');
    const account = await accountCollection.findOne({ AccountName: accountName });

    if (!account) {
      res.status(400).send({ message: 'Account not found' });
      return;
    }

    // Update the account in the database
    await accountCollection.updateOne({ AccountName: accountName }, { $set: { Valid: false } });

    res.send({ message: 'Account locked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put('/users/unlock-account', cors(), async (req, res) => {
  try {
    const accountName = req.body.AccountName;
    const adminPassword = req.body.AdminPassword;

    // Check if the admin credentials are correct
    const adminCollection = database.collection('Account');
    const adminAccount = await adminCollection.findOne({ Type: 'Admin' });

    if (!adminAccount) {
      res.status(400).send({ message: 'Invalid admin credentials' });
      return;
    }

    const crypto = require('crypto');
    const hash = crypto.pbkdf2Sync(adminPassword, adminAccount.salt, 1000, 64, 'sha512').toString('hex');
    if (hash !== adminAccount.Password) {
      res.status(400).send({ message: 'Invalid admin credentials' });
      return;
    }

    // Find the account in the database
    const accountCollection = database.collection('Account');
    const account = await accountCollection.findOne({ AccountName: accountName });

    if (!account) {
      res.status(400).send({ message: 'Account not found' });
      return;
    }

    // Update the account in the database
    await accountCollection.updateOne({ AccountName: accountName }, { $set: { Valid: true } });

    res.send({ message: 'Account unlocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put('/users/lock-or-unlock-account', cors(), async (req, res) => {
  const accountName = req.body.AccountName;
  const adminPassword = req.body.AdminPassword;
  const valid = req.body.Valid;

  // Check if the admin credentials are correct
  const adminCollection = database.collection('Account');
  const adminAccount = await adminCollection.findOne({ Type: 'Admin' });

  if (!adminAccount) {
    res.status(400).send({ message: 'Invalid admin credentials' });
    return;
  }

  const crypto = require('crypto');
  const hash = crypto.pbkdf2Sync(adminPassword, adminAccount.salt, 1000, 64, 'sha512').toString('hex');

  if (hash !== adminAccount.Password) {
    res.status(400).send({ message: 'Incorrect password' });
    return;
  }

  // Find the account in the database
  const accountCollection = database.collection('Account');
  const account = await accountCollection.findOne({ AccountName: accountName });

  if (!account) {
    res.status(400).send({ message: 'Account not found' });
    return;
  }

  // Update the account in the database
  const updateResult = await accountCollection.updateOne({ AccountName: accountName }, { $set: { Valid: valid } });

  res.send({ message: `Account ${valid ? 'unlocked' : 'locked'} successfully` });
})

app.put('/users/lock-or-unlock-accounts', cors(), async (req, res) => {
  const accountNames = req.body.AccountNames;
  const adminPassword = req.body.AdminPassword;
  const valid = req.body.Valid;
  // Check if the admin credentials are correct
  const adminCollection = database.collection('Account');
  const adminAccount = await adminCollection.findOne({ Type: 'Admin' });

  if (!adminAccount) {
    res.status(400).send({ message: 'Invalid admin credentials' });
    return;
  }

  const crypto = require('crypto');
  const hash = crypto.pbkdf2Sync(adminPassword, adminAccount.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== adminAccount.Password) {
    res.status(400).send({ message: 'Incorrect password' });
    return;
  }

  // Find the accounts in the database
  const accountCollection = database.collection('Account');
  const accounts = await accountCollection.find({ AccountName: { $in: accountNames } }).toArray();

  if (!accounts || accounts.length === 0) {
    res.status(400).send({ message: 'Accounts not found' });
    return;
  }

  // Update the accounts in the database
  const updateResult = await accountCollection.updateMany({ AccountName: { $in: accountNames } }, { $set: { Valid: valid } });

  res.send({ message: `${updateResult.modifiedCount} account(s) ${valid ? 'unlocked' : 'locked'} successfully` });
})