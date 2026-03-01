import { Request, Response } from "express";
import Product from "../database/models/Product";   
import { AuthRequest } from "../middleware/authMiddlerware";
import User from '../database/models/User'
import Category from '../database/models/Category'

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
async getAllProducts(req:Request, res:Response):Promise<void>{
    const data = await Product.findAll(
        {
            include :[
                {
                    model : User,
                    attributes : ['id', 'email', 'username']
                },
                {
                    model : Category,
                    attributes :['categoryName']
                }
            ]
        }
    )
    res.status(200).json({
        message : "Products fetched successfully",
        data
    })
}
async getSingleProduct(req:Request, res:Response):Promise<void>{
    const id = req.params.id
    const data = await Product.findAll({
        where :{
            id : id
        },
        include:[
            {
                model : User,
                attributes : ['id', 'email', 'username']
            },
            {
                model : Category,
                attributes : ['id', 'categoryName']
            }
        ]
    })
    if(data.length === 0){
        res.status(404).json({
            message : "No Product with that id"
        })
        
    }else{
        res.status(200).json({
            message : "Product fetched successfully",
            data
        })
    }
}   
async deleteProduct(req:AuthRequest, res:Response):Promise<void>{
    const {id} = req.params
    const data = await Product.findAll({
        where :{
            id : id
        }
    })
    if(data.length > 0){
        await Product.destroy({
             where : {
                id : id
             }
         })
         res.status(200).json({
            message : "Product deleted successfully"
         })  
    }else{
        res.status(404).json({
            message : "No Product with that id"
        })
    }

}
}
export default new ProductController()