const mongoose=require('mongoose')

// database details get from process.env file
const connectionString=process.env.DATABASE

// connection to mongodb
mongoose.connect(
    connectionString,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    }
).then(()=>{
    console.log("Mongodb Atlas connected successfully");
}).catch((error)=>{
    console.log(error);
})

