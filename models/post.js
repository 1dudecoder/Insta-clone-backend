const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:{
        type:[{type:ObjectId,ref:"User"}]
    },
    comments:{
        type:[{text:String,
            postedBy:{
            type: ObjectId,
            ref:"User"
        }}]
    },
    postedBy:{
        type: ObjectId,
        ref:"User"
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post
