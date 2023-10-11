const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
        },
    password:{
        type:String,
        required:true   
    },
    mobile:{
        type:String,
        required:true,
   
    },
    completedTask:[{
        type:String 
    }],
    inProgressTask:[{
        type:String
    }],
    task:[{
        // type:String
        type:Object
    }],
})

const user=mongoose.model("user",userSchema)
module.exports=user