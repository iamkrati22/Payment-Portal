const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "8888";
const bodyParser = require("body-parser");
const { time } = require("console");

var initialTime = +new Date();
console.log(initialTime);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const mongo = require("mongodb").MongoClient;
const dbUrl = "mongodb+srv://iamkrati22:Krati220502@cluster0.fsrxm.mongodb.net/testdb?retryWrites=true&w=majority";
var id = 0, userId = 0;
// var db, OTPs;
mongo.connect(dbUrl,(error,client) =>{
    let db, OTPs;
	db = client.db("testdb");
    db.collection("otp").find({}).toArray((err, res) =>{
        OTPs = res;
        console.log(OTPs);
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
		db.collection("otp").find({"userId" : (userName)},(err,result)=>{
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
		db.collection("otp").save(newUserData,(err, result) => {
			if (err) {
			return console.log(err);
			}
			console.log('click added to db');
			console.log(OTPs);
			res.sendStatus(201);
		});
	})
	app.get('/clicks', (req, res) => {

		db.collection("otp").find().toArray((err, result) => {
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
	// var count = 0;

  const getCount = () => Math.floor((new Date() - initialTime) / 1000);

  // const wait = async milliseconds => new Promise(resolve => setInterval(resolve, milliseconds));

  // (async () => {
  //   while (true) {
  //     await wait(1000);
  //     // if(count==60){
  //     //   count=0;
  //     //   }
  //     //   console.log(count);
  //     // count+=1;
  //     console.log(getCount());
  //   }
  // })();
  function updateAlgo(otp){
    return (otp+1);
  }
	setInterval(function(){
    db.collection("otp").find({}).toArray((err, res) => {
      res.map(q => new Promise(resolve => {
        const { id, otp } = q;
        const newOtp = updateAlgo(otp); // Algorithm here
        db.collection('otp').updateMany({ id }, { $set: { otp: newOtp } }, err => {
          if (err == null) resolve();
        });
      }));
    })
      db.collection('otp').updateMany({},{ $inc: {otp : 1 } });
      db.collection("otp").find({}).toArray((err, res) =>{
        OTPs = res;
        console.log(OTPs);
    });
    console.log("I am working");
	}, 60000);


	app.post('/test', async(req,res)=> {
	id += 1;
	console.log(req.body);
	console.log(typeof(req.body));
	userId = req.body.ID;
	sec=req.body.seconds;
	const t= await getTime();
	console.log(getCount());
	let diff=t-sec;
	if(diff<0){diff=0;}
	var currUserOTP = generateOTP();
	const newUserData = {id: id, userId: userId, otp: currUserOTP};
		//db.OTPs.insertOne(newUserData);
		db.collection("otp").save(newUserData,(err, result) => {
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

	app.listen(port,() =>{
		console.log(`Listening on http://localhost:${port}`);
	});
});
