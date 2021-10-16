const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post")
const requireLogin = require("../middleware/requirelogin")

router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy: req.user._id})
    .then((myposts)=>{
        res.json({myposts})
    })
    .catch((err)=>{
        console.log(err);
    })
})

router.get("/allpost",(req,res)=>{
    Post.find()
    .populate("postedBy","__id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.send(422).json({error:"please add all the fields"})
    }
    // console.log(req.user);
    //this will remove the passsword and --v from the data of req.user then can save it to user
    req.user.password = undefined;

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user
    })

    post.save()
        .then((result)=>{
            res.json({post:result})
        })
        .catch((err)=>{
            res.json({Error:"please fill all the fields correctly"})
        })
})




module.exports = router
