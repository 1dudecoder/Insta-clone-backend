const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//liberies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middleware
const {JWT_SECRET} = require("../keys")


//db
const User = require("../models/user");


router.get("/",(req,res)=>{
    res.send("weclome to home page")
})

router.post("/signup",(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status("422").json({error:"please enter the all fields" })
    }
    
    bcrypt.hash(password,12).then((hashedpassword)=>{
        User.findOne({email:email})
        .then((saveduser) => {
    
            if(saveduser){
                return res.status(422).json({error:"user is already registored "})
            }
                
                const user = new User({
                    name,
                    email,
                    password: hashedpassword
                })
    
                user.save()
                    .then(user => {
                        res.json({ message:"successfully data added to the server"})
                    })
                    .catch(err => {console.log(err)})
        })
    })

})

router.post("/signin",(req,res)=>{
    const{email,password} = req.body;
    if(!email || !password){
        res.status(422).json({error:"please enter all the fields correctly"})
    } 
    User.findOne({email:email})
        .then((saveduser)=>{ 
            console.log(saveduser)
            if(!saveduser){
                return res.status(422).json({error:"Invaild Email or Password"})
            }
            bcrypt.compare(password,saveduser.password).then((domatch)=>{
                if(domatch){
                    // res.json({message :"successfully login"})
                    const token = jwt.sign({_id: saveduser._id},JWT_SECRET);
                    const {_id,name,email,followers,following} = saveduser;
                    res.json({token,user:{_id,name,email,followers,following}})
                }else{
                    return res.status(422).json({error:"Invaild Email or Password"})
                }
            })
            .catch((err)=> console.log(err));
        })
})

module.exports = router;