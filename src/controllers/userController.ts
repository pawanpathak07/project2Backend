import { Request, Response } from "express"
import User from "../database/models/User"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class AuthController{
   public static async registerUser(req:Request,res:Response):Promise<void>{

        const {username,email,password,role} = req.body
        if(!username || !email || !password){
        // Logic to register user
        res.status(400).json({message:"User registered successfully"
        })
        return
    }
   await User.create({
        username,
        email,
        password : bcrypt.hashSync(password,10),
        role : role
    })
    res.status(200).json({
        message: "user registered successfully"
    })

}
public static async loginUser(req:Request,res:Response):Promise<void>{
    // user input email and password
    const {email,password} = req.body
    if(!email || !password){
        res.status(400).json({  
            message:"Please provide email and password"
        })
        return
    }
    //check wheather user with above email exist ot not

    const [data] = await User.findAll({
        where : {
            email : email
        }
    })
    if(!data){
        res.status(400).json({
            message:"No user with that email"
        })
        return
    }

    //check password now
    const isMatched = bcrypt.compareSync(password,data.password)
    if(!isMatched){
        res.status(403).json({
            message:"Invalid password"
        })
        return
    }
    //generate token and send to user
    // res.status(200).json({
    //     message:"User logged in successfully"
    // })

    //generate token
   const token = jwt.sign({id:data.id}, process.env.SECRET_KEY as string,{
        expiresIn:"1hr"
    })
    res.status(200).json({
        message:"User logged in successfully",
        data : token
    })
}
}
export default AuthController