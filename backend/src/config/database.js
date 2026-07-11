const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Server connected to database");
    }catch(err){
        console.log("Error connecting to database:\n",err);
    }
}

module.exports = connectDB;