const user=require('../models/userSchema');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
exports.register=async (req,res,next)=>{
    console.log("inside user register")
    const {email,password,mobile}=req.body
    
    if(!email || !password || !mobile){
        res.status(401).json("Please enter all the inputs")
    }
    else{
        try{
            const response=await user.findOne({email})
            if(response){
                res.status(401).json("user is already registered. Please login!")
            }
            else{
            
               const newPassword=bcrypt.hashSync(password)
            console.log(newPassword);
               const newUser=new user({
                    email,
                    password:newPassword,
                    mobile:mobile
                })
                await newUser.save()
                res.status(200).json("user registered successfully")
            }
        }
        catch(error){
            res.status(406).json(error)
        }
    }
}

exports.login= async (req,res,next)=>{
    const {email,password}=req.body
    console.log("Inside user login");
    if(!email || !password){
        res.status(401).json("Please enter a valid input")
    }
    else{
        console.log("data exist");
        try{
            const userExist= await user.findOne({email})
            if(userExist){
                const isPasswordSame=bcrypt.compareSync(password,userExist.password)
                if(isPasswordSame){
                    const token=jwt.sign({id:userExist._id},process.env.SECRET_KEY,
                        {
                            expiresIn:'7d'
                            // admin can't add movies after 7days
                        })
                   return res.status(200).json({message:"user logged in successfully",token,id:userExist._id})
                }
                else{
                    res.status(401).json("Invalid password")
                }
            }
            else{
                res.status(401).json("user does not exist")
            }
        }
        catch(error){
            res.status(406).json(error)
        }
    }
}


exports.addTask= async (req,res,next)=>{
    // const {task,id}=req.body
    const {taskname,description,deadline,assignedProject,id}=req.body

    console.log("inside add task");
    if(!taskname || !description || !deadline || !assignedProject){
        res.status(401).json("Please enter a valid input")
    }
    else{
        
        if(!id){
            return res.status(401).json("No user id found to add user")
        }
        newTask={taskname:taskname,description:description,deadline:deadline,assignedProject:assignedProject,assignedDate:new Date(),status:"created"}
        console.log("task got");

        const options = { upsert: true };
        try{
            const response=await user.findOne({_id:id})
            // task=[{...task},{...response.task}]
            // task={...response.task}
            console.log(newTask);
            const filter = { _id:id };
            const updateData =  {task:[...response.task,newTask]  }
                //  task:task
              
            const result = await user.updateOne(filter,updateData,options);
    
            
            res.status(200).json("user task added successfully")
        }
        catch(error){
            res.status(406).json(error)
        }
    }
}

exports.getTask= async (req,res,next)=>{
    const {id}=req.body
    try{
        const response=await user.findOne({_id:id})
        res.status(200).json({tasks:response.task,email:response.email})
    }
    catch(error){
        res.status(406).json(error)
    }
 
}

exports.getEditTask=async (req,res,next)=>{
    const {tname,id}=req.body

    let count
    try{
         
          const response=await user.findOne({_id:id})
        //   console.log(response.task);
          response.task.map((item,index)=>{

            console.log(item.taskname)
           
            if(item.taskname==tname){
                count=index
                // return console.log("found count ",count);
                return res.status(200).json({index:count,taskDetails:item})
            }
          
        })
        
    }
    catch(error){
        res.status(406).json(error)
    }
}

exports.setEditTask= async (req,res)=>{
    const {taskname,description,deadline,assignedProject,assignedDate,id,index}=req.body
    let tindex=index
    console.log("inside setEditTask");
    const response=await user.findOne({_id:id})
    
    const options = { upsert: true };
     const filter = { _id:id };

    response.task[index]={
        taskname:taskname,description:description,deadline:deadline,assignedProject:assignedProject,assignedDate:assignedDate,status:"created"
    }
    const updateData =  {task:[...response.task]  }
    console.log("update",updateData);
    //  task:task
  
    const result = await user.updateOne(filter,updateData,options);
    console.log(response.task);
    res.status(200).json("user task updated successfully")
}

exports.deleteTask=async (req,res)=>{
    const {id,index}=req.body
    let tindex=index
    const options = { upsert: true };
     const filter = { _id:id };

     const response=await user.findOne({_id:id})
     const tasks=response.task.filter((item,index)=>{
        if(index!=tindex){
          return {...item}
        }
     })
    

   
    const updateData =  {task:[...tasks]  }


  try{
    const result = await user.updateOne(filter,updateData,options);
  
    res.status(200).json(" task deleted successfully")
  }
  catch(error){
    res.status(406).json(error)
  }
}

exports.updateStatus=async (req,res)=>{
    const {status,id,index}=req.body
    let tindex=index
    const options = { upsert: true };
    const filter = { _id:id };
    const response=await user.findOne({_id:id})
    
    response.task[index].status=status
    
    const updateData =  {task:[...response.task]  }

    
  try{
    const result = await user.updateOne(filter,updateData,options);
  
    res.status(200).json(" status updated successfully")
  }
  catch(error){
    res.status(406).json(error)
  }
}

// exports.sortTask=async (req,res)=>{
//     const {id}=req.body
//     const options = { upsert: true };
//     const filter = { _id:id };
//     try{

//     console.log(response);
//         res.status(200).json(response)
//       }
//       catch(error){
//         res.status(406).json(error)
//       }
// }