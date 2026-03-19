import { Response } from 'express';
import { OrderData, PaymentMethod } from './../types/orderTypes';
import { AuthRequest } from "../middleware/authMiddlerware";
import Order from '../database/models/Order';
import Payment from '../database/models/Payment';
import OrderDetail from "../database/models/OrderDetail";

 const items = [
{
    quantity : 2,
    prodductId : 2
 }, 
 {
    quantity : 2,
    prodductId : 2
 }, 
 {
    quantity : 2,
    prodductId : 2
 }
]
 
 

class OrderController {
    async createOrder(req: AuthRequest, res: Response):Promise<void> {
        const userId = req.user?.id
        const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderData = req.body
        if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length == 0) {
            res.status(400).json({
              message : "Please provide phoneNumber, shippingAddress, totalAmount, paymentDetail, items"
        })
        return
        }
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId
        })
        await Payment.create({
            paymentMethod : paymentDetails.paymentMethod,
        })
        for (var i=0 ; i<items.length ; i++)
            await OrderDetail.create({
            quantity : items[i].quantity,
            productId : items[0].productId,
            orderId : orderData.id
        })
        if(paymentDetails.paymentMethod === PaymentMethod.Khalti){
            //khalti integration
        }else{
            res.status(200).json({
                message : "Order placed successfully"
            })
        }
    }
}