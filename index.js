const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "8888";
const bodyParser = require("body-parser");
const { time } = require("console");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const mongo = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017/testdb";
var id = 0, userId = 0;
var db, OTPs;
mongo.connect(dbUrl,(error,client) =>{
    db = client.db("testdb");
    db.collection("OTPs").find({}).toArray((err, res) =>{
        OTPs = res;
        console.log(OTPs);
    });
});
app.listen(port,() =>{
    console.log(`Listening on http://localhost:${port}`);
});

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.get("/", (req,res) =>{
    res.render("layout", {title: "Home", userData: OTPs});
});
app.get("/payment", (req,res) =>{
  res.render("payment", {title: "Payment"});
  app.post('/verify', (req,res)=>{
    let userName = req.body.Username;
    let userOTP = req.body.OTP;
    console.log(userName + "\t" + userOTP);
    db.collection("OTPs").findOne({"userId" : (userName)},(err,result)=>{
      if (err) throw err;
      if(result.otp === parseInt(userOTP))
      res.send("Verified");
      else
      res.send("Not Verified");
    });

  });
});


app.post('/clicked', (req,res)=>{
    id += 1;
    userId += 1;
    const newUserData = {id: id, userId: userId, otp: generateOTP()};
    //db.OTPs.insertOne(newUserData);
    db.collection('OTPs').save(newUserData,(err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('click added to db');
        console.log(OTPs);
        res.sendStatus(201);
      });
})
app.get('/clicks', (req, res) => {

    db.collection('OTPs').find().toArray((err, result) => {
      if (err) return console.log(err);
      res.send(result);
    });
  });

app.get('/test',(req,res)=>{
    res.status(200).send({
        clientTime:90,
        userID:"test@gmail.com"
    })
});


function generateOTP(){
    return (Math.floor((Math.random() * 1000000) + 1));
}

// pre-ES6:
// const NtpTimeSync = require("ntp-time-sync").NtpTimeSync;

// request 1
// timeSync.getTime().then(function (result) {
//   console.log("current system time", new Date());
//   console.log("real time", result.now);
//   console.log("offset in milliseconds", result.offset);
// })

// // request 2, will use cached offset from previous request
// timeSync.getTime().then(function (result) {
//   console.log("current system time", new Date());
//   console.log("real time", result.now);
//   console.log("offset in milliseconds", result.offset);
// })
// timeSync.getTime().then(function (result) {
//   console.log("current system time", new Date());
//   console.log("real time", result.now);
//   console.log("offset in milliseconds", result.offset);
// })
// ES2017 style
// const result =  timeSync.getTime();
// console.log("real time", result.now);
var count = 0;

setInterval(function(){
  db.collection('OTPs').updateMany({},{ $inc: {otp : 1 } });
  console.log("I am working");
  setInterval(function refreshcal(){
    if(count==60){
      count=0;
    }
   count+=1;
  },1000);
}, 60000);


app.post('/test', async(req,res)=> {
  id += 1;
  console.log(req.body);
  console.log(typeof(req.body));
  userId = req.body.ID;
  sec=req.body.seconds;
  const t= await getTime();
  console.log(count);
  let diff=t-sec;
  if(diff<0){diff=0;}
  var currUserOTP = generateOTP();
  const newUserData = {id: id, userId: userId, otp: currUserOTP};
    //db.OTPs.insertOne(newUserData);
    db.collection('OTPs').save(newUserData,(err, result) => {
        if (err) {
          console.log(err);
        }
        console.log('click added to db');
        console.log(OTPs);
        return res.status(200).send({'otp':currUserOTP, 'delay':diff});
      });
})

async function getTime() {
  let obj=new Date();
  const NtpTimeSync = require("ntp-time-sync").NtpTimeSync;
  const timeSync = NtpTimeSync.getInstance();
  let a=await timeSync.now();
  let obj1=new Date();
  let sd= a.getSeconds() - (obj1.getSeconds()-obj.getSeconds());
  return sd;
}