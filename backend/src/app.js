const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

const authRouter = require('../src/routes/auth.route')

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);

module.exports = app;