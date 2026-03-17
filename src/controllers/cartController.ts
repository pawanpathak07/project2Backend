import Cart from '../database/models/Cart';
import Category from '../database/models/Category';
import Product from '../database/models/Product';
import { AuthRequest } from './../middleware/authMiddlerware';
import { Request, Response } from 'express';


class CartController {
    async addToCart(req: AuthRequest, res: Response) {
        const userId = req.user?.id
        const { quantity, productId } = req.body
        if (!quantity || !productId) {
            res.status(400).json({ message: "Please provide quantity and productId" })
        }
        // check if the product alredy exists in the cart table or not
        let cartItem = await Cart.findOne({
            where: {
                productId,
                userId
            }
        })
        if (cartItem) {
            cartItem.quantity += quantity
            await cartItem.save()
        } else {
            //insert into cart table
            await Cart.create({
                quantity,
                userId,
                productId
            })
        }
        res.status(200).json({
            message: "Product added to cart",
            data: cartItem
        })
    }

    async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id
        const cartItems = await Cart.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Product,
                    attributes: ['productName', 'productImageUrl', 'productPrice'],
                    include: [
                        {
                            model: Category,
                            attributes: ['id', 'categoryName']
                        }
                    ]
                }
            ],
         attributes : ['productId', 'quantity']
        })
        if (cartItems.length === 0) {
            res.status(404).json({
                message: "No items in cart"
            })

        } else {
            res.status(200).json({
                message: "Cart items fetched successfully",
                data: cartItems
            })
        }

    }

    async deleteMyCartItem(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id
        const { productId } = req.params as { productId: string }
        //check wheather above productId product exist or not
        const product = await Product.findByPk(productId)
        if (!product) {
            res.status(404).json({
                message: "No product with that id"
            })
            return
        }
        //delete that prductId from userCart
        await Cart.destroy({
            where: {
                userId,
                productId
            }
        })
        res.status(200).json({
            message: "Product of cart deleted successfully"
        })
    }

async updateCartItem(req:AuthRequest, res:Response):Promise<void>{
    const {productId} =req.params
    const userId = req.user?.id
    const {quantity} = req.body
    if(!quantity){
        res.status(400).json({
            message:"Please provide quantity"
        })
        return
    }
    const cartData = await Cart.findOne({
        where:{
            userId,
            productId
        }
    })
     if(!cartData){
        res.status(404).json({
            message: "Cart item not found"
        })
        return
    }
    cartData.quantity = quantity
    await cartData?.save()
    res.status(200).json({
        message:"Product of Cart item updated successfully",
        data : cartData
})
}
}




export default new CartController()