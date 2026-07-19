require('dotenv').config();

const app = require('./src/app');
const generateInterviewReport = require('./src/services/ai.service')
const {jobDescription, resume, selfDescription} = require('./src/services/temp')
const connectDB = require('./src/config/database');

connectDB();

generateInterviewReport({jobDescription, resume, selfDescription})

app.listen(3000,()=>{
    console.log("Server running on port http://localhost:3000");
});