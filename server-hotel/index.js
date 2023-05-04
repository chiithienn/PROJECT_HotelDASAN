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
client = new  MongoClient("mongodb://127.0.0.1:27017")
client.connect()
database = client.db("TestData")
orderCollection = database.collection("Order")
orderDetailCollection = database.collection("OrderDetail")
// fashionCollection = database.collection("Room")
branchCollection = database.collection("BranchHotel")
roomCollection = database.collection("RoomHotel")

// ---------------------- ORDER - ORDER DETAIL ----------------------

// Lấy ra toàn bộ order và các order detail của nó
app.get("/orders", cors(), async (req, res) => {
  try {
    const orders = await orderCollection.aggregate([
      {
        $lookup: {
          from: "OrderDetail",
          localField: "_id",
          foreignField: "OrderID",
          as: "OrderDetails",
        },
      },
    ]).toArray();
    
    res.send(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ---------------------- BRANCH - ROOM ----------------------

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
  res.send("Đã xoá phòng thành công!");
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

// ---------------------- ACCOUNT ----------------------

app.get("/users",cors(),async(req, res)=>{
  accountCollection = database.collection("Account")
  const accounts = await accountCollection.find({Type:"Customer"}).toArray();
  res.send(accounts)
})

app.post("/users",cors(),async(req,res)=>{
  var crypto = require('crypto')
  salt = crypto.randomBytes(16).toString('hex')

  accountCollection = database.collection("Account")
  account=req.body

  hash = crypto.pbkdf2Sync(account.Password, salt, 1000, 64, `sha512`).toString(`hex`)

  account.Password = hash
  account.Type = "Customer"
  account.salt = salt

  await accountCollection.insertOne(account)

  res.send(req.body)
})

app.post("/login",cors(),async (req,res)=>{
  AccountName=req.body.AccountName
  Password=req.body.Password
  // AccountType=req.body.AccountType
  // FullName=req.body.FullName
  // PhoneNumber=req.body.PhoneNumber
  // IDCard=req.body.IDCard
  // DOB=req.body.DOB

  var crypto = require("crypto")

  accountCollection = database.collection("Account")
  account = await accountCollection.findOne({AccountName:AccountName})
  if(account==null){
    res.send({"AccountName":AccountName,"message":"Account not exist"})
  } else{
    hash = crypto.pbkdf2Sync(Password, account.salt, 1000, 64, `sha512`).toString(`hex`)
    if(account.Password==hash){
      res.send(account)
    } else{
      res.send({"AccountName":AccountName, "Password":Password, "message":"wrong password"})
    }
  }
})

app.put('/users/change-password/:id', cors(), async (req, res) => {
  const userId = req.params.id;
  const accountName = req.body.AccountName;
  const currentPassword = req.body.CurrentPassword;
  const newPassword = req.body.NewPassword;
  const confirmNewPassword = req.body.ConfirmNewPassword;

  // Check if both new passwords match
  if (newPassword !== confirmNewPassword) {
    res.status(400).json({ message: 'New passwords do not match' });
    return;
  }

  // Find the account in the database
  const accountCollection = database.collection('Account');
  const account = await accountCollection.findOne({ _id: new ObjectId(userId), AccountName: accountName });

  // Check if the current password is correct
  const crypto = require('crypto');
  const hash = crypto.pbkdf2Sync(currentPassword, account.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== account.Password) {
    res.status(400).json({ message: 'Incorrect current password' });
    return;
  }

  // Update the password in the database
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, 'sha512').toString('hex');
  await accountCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { Password: newHash, salt: newSalt } });

  res.json({ message: 'Password updated successfully' });
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