import User from "../models/user.model.js";
// import { bcryptjs } from "bcryptjs";
// import pkg from 'bcryptjs';
// const { bcryptjs } = pkg;
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    // we will get the info when the user logs in 
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json("User created Successfully")
    } catch (error) {
        next(error)
    }
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body
    try {
        const validUser = await User.findOne({email:email})
        if(!validUser) return next(errorHandler(404,'User not found'))
        const validPassword = bcrypt.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials'))
            // creating a token for a cookie so that we can save the user info inside the browser
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        // doing this because we don't want to send the password so we just extract the password
        const {password:pass,...rest} = validUser._doc
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}