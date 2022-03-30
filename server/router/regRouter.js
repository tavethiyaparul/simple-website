const express = require('express')
const app = express()
const User = require('../model/regModel')
const bcrypt = require("bcrypt")
const auth = require("../middleware/auth")
const jwt =require("jsonwebtoken")

app.get('/signup', async (req, res) => {
    //all field search
    const search = req.query.search;
    let filter = {};
    if (search) {
        const regex = new RegExp(search, "i");
        filter["$or"] = [
            { "description": regex },
            { "name": regex },
        ]
    }
    // const cursor= await User.find( { name: { $regex:search, $options: 'si' } } ); 
    const cursor = await User.find(filter);

    // const set  = await User.aggregate({$set:{
    //     totalmark:{$sum:"$mark"}
    // }})
    // const cursor= await User.find({description:{$regex:search})); 
    res.send(cursor)
})

app.post('/signup', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body
    if (!name || !email || !phone || !password || !work || !cpassword) {
        return res.status(404).json({ error: "enter valid data" })
    }

    try {
        const userexit = await User.findOne({ email: email })
        if (userexit) {
            return res.status(404).json({ error: "already register" })
        }

        if (password === cpassword) {
            const user = new User({ name, email, phone, work, password })
            console.log("data", user);

            const token = await user.gencreateToken()
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now() +25892000000),
                httpOnly:true  
            })

            //store cookies
            // res.cookie("Test","thapa")

            await user.save()
            console.log("data save");
            // res.status(201).json({ msg: "register success" })
            // const data = await User.create(req.body)
            res.send(user)
        }
        else {
            console.log("password not match");
            res.send("password does not matched")
        }
    } catch (error) {
        console.log(error);
        res.status(402).send(error)
    }
})


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "enter data" })
        }

        const userlogin = await User.findOne({
            email: email
        })
     
        if (userlogin) {
            const match = await bcrypt.compare(password, userlogin.password)
            const token = await userlogin.gencreateToken()
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now() +25892000000),
                httpOnly:true  
            })
            if (!match) {
                res.status(400).json({ error: "not valid data" })
            }
            else {
                res.json({ msg: "login success" })
            }

        } else {
            res.status(400).json({ error: "not valid data" })
        }

    } catch (error) {
        console.log(error);
    }
})

app.get("/about",auth,async (req,res)=>{
 console.log("hello about world from the server");
//  console.log(req.rootuser);
 res.send(req.rootuser)
})

app.get("/getdata",auth,async (req,res)=>{
    console.log("hello my about");
          res.send(req.rootuser)
    
})


app.post("/contact",auth,async (req,res)=>{
   try {
       const {name,email,phone,msg} =req.body
       if(!name || !email|| !phone|| !msg){
           return res.json({error:"plz input the contact form"})
        }
        const usercontact = await User.findOne({_id: req.userid})

        if(usercontact){ 
            const usermsg =await usercontact.addmessage(name,email,phone,msg);
            console.log(usermsg);
            await usercontact.save()
            res.status(201).json({message:"user contct form save"})
        }
      
   } catch (error) {
       console.log(error);
   }
})


app.get("/logout",async (req,res)=>{
    console.log("Logout user");
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("user logout")
})



module.exports = app