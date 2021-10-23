const express = require("express");
const router = express.Router();
const Post = require("../models/post")
const mongoose = require("mongoose");
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

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","__id name")
    .populate("comments.postedBy","name _id ")
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err);
    })
})

router.get("/getsubpost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","__id name")
    .populate("comments.postedBy","name _id ")
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

router.put("/like",requireLogin,(req,res)=>{
    //phele post id se id nikali esse pta chlega konsa post tha 
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
        //push se hum array mai push krengye likes wale mai user ki id jo pheli se login hone pr server ne store kr k rkhi thi login required k ander dekho 
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    //phele post id se id nikali esse pta chlega konsa post tha 
    Post.findByIdAndUpdate(req.body.postId,{
        //push se hum array mai push krengye likes wale mai user ki id jo pheli se login hone pr server ne store kr k rkhi thi login required k ander dekho 
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put("/comment",requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","name _id ")
    .populate("postedBy","__id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})





router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{  //ye sever mai hi excute krwa deta hai 
        if(err || !post){
            return res.status(422).json({error:err})
        }

        if(post.postedBy._id.toString() == req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})


module.exports = router
