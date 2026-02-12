import { Request, Response } from "express"
import User from "../database/models/User"
import bcrypt from 'bcrypt'


class AuthController{
   public static async registerUser(req:Request,res:Response):Promise<void>{

        const {username,email,password} = req.body
        if(!username || !email || !password){
        // Logic to register user
        res.status(400).json({message:"User registered successfully"
        })
        return
    }
   await User.create({
        username,
        email,
        password : bcrypt.hashSync(password,10) 
    })
    res.status(200).json({
        message: "user registered successfully"
    })
}
}

export default AuthController