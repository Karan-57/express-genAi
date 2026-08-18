
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

const authRouter = require('../src/routes/auth.route')
const interviewRouter = require('./routes/interview.routes')

const allowedOrigins = [
  "http://localhost:5173",
  "https://express-gen-ai-sage.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports = app;