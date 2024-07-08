import User from "../models/user.model.js";
// import { bcryptjs } from "bcryptjs";
// import pkg from 'bcryptjs';
// const { bcryptjs } = pkg;
import bcrypt from 'bcryptjs'

export const signup = async (req,res)=>{
    const {username,email,password} = req.body;
    // we will get the info when the user logs in 
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json("User created Successfully")
    } catch (error) {
        res.status(500).json(error.message)
    }
}