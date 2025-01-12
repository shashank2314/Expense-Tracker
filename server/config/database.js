const mongoose = require("mongoose");

require("dotenv").config();

exports.dbconnect = () =>{
    
    mongoose.connect(process.env.MONGODB_URI,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
    })
    .then(()=>{
        console.log("db connection successfully");
    }
    )
    .catch((err)=>{
        console.log("db connection failed");
        console.log(err);
        process.exit(1);
    })
    
}