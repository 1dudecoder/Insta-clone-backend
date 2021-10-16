const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURL} = require("./keys")
const User = require("./models/user")

const authrouter = require("./routes/auth");
const postrouter = require("./routes/post");

//connecting
mongoose.connect(MONGOURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then((data)=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })

//middleware
app.use(express.json());
app.use(authrouter);
app.use(postrouter);



//listiner
app.listen(PORT,console.log("server is running at",PORT));