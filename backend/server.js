require('dotenv').config();

const app = require('./src/app');65
const connectDB = require('./src/config/database');

connectDB();

app.listen(3000,()=>{
    console.log("Server running on port http://localhost:3000");
});