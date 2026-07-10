const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')


/**
 * @name registerUserController
 * @description register new user
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
        passwordHash
    });

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie("token",token);

    res.status(201).json({
        message:"user registered successfully";
    });
}