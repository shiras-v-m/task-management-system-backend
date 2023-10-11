// load environmental variable from .env to process.env
require('dotenv').config()

// import express to create server
const express=require('express')

// allow client to make request for resources from front-end to back-end
const cors=require('cors')

// creating server
const server=express()

// setup port number for server
const PORT = 4000 || process.env.PORT


// use cor,json parser in server app ( Javascript doesn't know json)
server.use(cors())
server.use(express.json())

const userRouter=require('./Routes/userRouter')

server.use(userRouter)
require('./db/connection')

// run server
server.listen(PORT,()=>{
    console.log('Task management server started at port number ',PORT);
})


server.get('/',(req,res)=>{
    res.send("<h2 style='text-align:center;color:green;'>Task management server started successfully!</h2>")
})