const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
let alert = require('alert');

//var JSAlert = require("js-alert");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://utkarsh:task101@cluster0.hhpvd.mongodb.net/bankingDB",{useNewUrlParser:true});
app.set('view engine', 'ejs');
app.use(express.static("public"));
// schema
const bankingSchema ={
  userid:Number,
  name:String,
  email:String,
  balance:Number
};
const transferSchema ={
  sender:String,
  receiver:String,
  amount:Number,
}
// model
// collection name=Person
const History=mongoose.model("History",transferSchema);
const Person=mongoose.model("Person",bankingSchema);
// add data
const a =new Person({
  userid:1,
  name:"Utkarsh",
  email:"utkarsh@gmail.com",
  balance: 110000
});
const b =new Person({
  userid:2,
  name:"Vishal",
  email:"vishal@gmail.com",
  balance: 215000
});
const c =new Person({
  userid:3,
  name:"Ujjwal",
  email:"ujjwal@gmail.com",
  balance: 199000
});
const d =new Person({
  userid:4,
  name:"Upasak",
  email:"upasak@gmail.com",
  balance: 150500
});
const e =new Person({
  userid:5,
  name:"Sid",
  email:"sid@gmail.com",
  balance: 220000
});
const f =new Person({
  userid:6,
  name:"Tushar",
  email:"tushar@gmail.com",
  balance: 198000
});
const g =new Person({
  userid:7,
  name:"Virat",
  email:"virat@gmail.com",
  balance: 180000
});
const h =new Person({
  userid:8,
  name:"Rahul",
  email:"rahul@gmail.com",
  balance: 178000
});


 const arr=[a,b,c,d,e,f,g,h];
Person.find({},function(er,foundItems){
  if(!er)
  {
      if(!foundItems)
    {
      Person.insertMany(arr,function(err){
        if(!err)
        {
          console.log("successfully added");
        }
        else{
          console.log("Opps Error: "+err);
        }
      });
    }
     else {
       console.log("customers are present");
     }

  }
  else {
    console.log("Error in inserting: "+er);
  }
});

app.get("/",function(req,res){
  res.render("home");
});
app.get("/users",function(req,res){
//  Swal.fire('Hello world!')
  Person.find({},function(err,foundItems){
    if(!err)
    {
      res.render("users",{list:foundItems});
    }
    else {console.log("something went wrong while loading users page");}
  });
});
let sender ="";
app.post("/transfer",function(req,res){
  const name=req.body.transferbtn;
  sender=name;
  console.log(sender);
  Person.find({},function(ERR,listfound){
    if(!ERR)
    {
      Person.findOne({name:name},function(err,foundItems){
        if(!err){
          if(!foundItems)
          {
            console.log("No items");
          }
          else{res.render("transfer",{sender:foundItems,list:listfound});}

        }
        else {console.log(err);}
      });
    }
  });
});
app.post("/transaction",function(req,res){
  let amount=  parseInt(req.body.amount);
  let receiver=req.body.receiver;





  if(amount===0)
  {
    //swal("Payment must be atleast of Rupee 1");
    //JSAlert.alert("This will only last 10 seconds");
    alert(" TRANSFER ERROR: MINIMUM AMOUNT MUST BE 1 RUPEE");

  }
 else if(receiver==="TRANSFER MONEY")
  {
    //  Swal.fire("Select a receiver")
  }
  else{
     alert("MONEY SUCCESSFULLY TRANSFERED");
    // let  sendercurbal=0;
    // let receivercurbal=0;
    Person.findOne({name:sender},function(err,foundItems){
      if(!err)
      {
        let sendercurbal=foundItems.balance;
        console.log(sendercurbal);
        Person.findOneAndUpdate({name:sender},{balance:sendercurbal-amount},function(er,data){
          if(!er)
          {
            console.log("sender amount updated");
          }
        });
      }
    });
    Person.findOne({name:receiver},function(err,foundItems){
      if(!err)
      {
       let   receivercurbal=foundItems.balance;
        console.log(receivercurbal);
        Person.findOneAndUpdate({name:receiver},{balance:receivercurbal+amount},function(er,data){
         if(!er)
         {
           console.log("receiver amount updated");
         }
       });
      }
    });
    const newtrans= new History({
      sender:sender,
      receiver:receiver,
      amount:amount
    });
    newtrans.save();

  }
  console.log(receiver);
   console.log( amount);
  res.redirect("/users");
});
app.get("/transaction",function(req,res){
  History.find({},function(err,foundItems){
    if(!err)
    {
      res.render("transaction",{transhis:foundItems});
    }
    else{console.log("error in trnx page");}
  });

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port, function() {
  console.log("Server has started ");
});
