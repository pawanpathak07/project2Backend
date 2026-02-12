import { Request, Response } from "express";
import Product from "../database/models/Product";   

class ProductController{
    public static async addProduct(req:Request,res:Response):Promise<void>{

        const {name,description,price} = req.body
        if(!name || !description || !price){
        // Logic to register user
        res.status(400).json({message:"Product added successfully"
        })
        return
    }   
    await Product.create({
        name,
        description,
        price
    })  
    res.status(200).json({
        message: "Product added successfully"
    })
}   
}   
export default ProductController