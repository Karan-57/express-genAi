const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')


/**
 * @name registerUserController
 * @description register new user, expect username, email and password
 * @access Public
 */

async function registerUserController(req,res){
    const {email, username, password} = req.body;
    
    if(!email || !username || !password){
        return res.status(400).json({
            message:"username, email & password is required"
        });
    }

    const userAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    });

    if(userAlreadyExists){
        return res.status(400).json({
            message:"user with email and password already exists"
        });
    }

    const passwordHash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        email,
        username,
        password:passwordHash
    });

    const token = jwt.sign({id:user._id, username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie("token",token);

    res.status(201).json({
        message:"user registered successfully",
        user:{
            username:user.username,
            email:user.email
        }
    });
}


/**
 * @name loginUserController
 * @description login a user, expect email and password
 * @access Public
 */

async function loginUserController(req,res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message:"email and password is required"
        });
    }

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"Incorrect email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return  res.status(401).json({
            message:"Incorrect email or password"
        });
    }

    const token = jwt.sign({
        id:user._id,
        username:user._username
    },process.env.JWT_SECRET,{
        expiresIn:"1d"
    });

    res.cookie("token",token);

    res.status(200).json({
        message:"user logged in",
        user:{
            username:user.username,
            email:user.email
        }
    });
}

module.exports = {registerUserController, loginUserController}