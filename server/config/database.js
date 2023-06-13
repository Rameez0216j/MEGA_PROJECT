const mongoose=require("mongoose")
require("dotenv").config();

exports.connectDB = ()=>{
    mongoose.connect(process.env.DataBase_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=> console.log("DB connected successfully!"))
    .catch((error)=>{
        console.log(error);
        console.log("DB connection failed!");
        process.exit(1);
    })
}