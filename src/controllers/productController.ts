import { Request, Response } from "express";
import Product from "../database/models/Product";   
import { AuthRequest } from "../middleware/authMiddlerware";

class ProductController{
    async addProduct(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const {productName,productDescription,productTotalStockQty, productPrice, categoryId} = req.body
        let fileName
        if(req.file){
            fileName = req.file?.filename
        }else{
            fileName = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW1yhlTpkCnujnhzP-xioiy9RdDQkKLMnMSg&s"
        }
        if(!productName || !productDescription || !productTotalStockQty || !productPrice || !categoryId){
        // Logic to register user
        res.status(400).json({message:"Please provide productName,productDescription,productTotalStockQty, productPrice, categoryId"
        })
        return
    }   
    await Product.create({
        productName,
        productDescription,
        productTotalStockQty, 
        productPrice,
        productImageUrl : fileName,
        userId : userId,
        categoryId : categoryId
    })  
    res.status(200).json({
        message: "Product added successfully"
    })
}   
}   
export default new ProductController()