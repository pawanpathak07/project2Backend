import { Response, Request } from 'express';
import { OrderData, PaymentMethod, KhaltiResponse, TransactionVerificationResponse, TransactionStatus, Orderstatus, PaymentStatus } from './../types/orderTypes';
import { AuthRequest } from "../middleware/authMiddlerware";
import Order from '../database/models/Order';
import Payment from '../database/models/Payment';
import OrderDetail from "../database/models/OrderDetail";
import axios from 'axios';
import Product from '../database/models/Product';

class ExtenedOrder extends Order {
    declare paymentId: string | null;
}

class OrderController {
    async createOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id
        const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderData = req.body
        if (!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length == 0) {
            res.status(400).json({
                message: "Please provide phoneNumber, shippingAddress, totalAmount, paymentDetail, items"
            })
            return
        }

        const paymentData = await Payment.create({
            paymentMethod: paymentDetails.paymentMethod
        })
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId: paymentData.id
        })

        for (var i = 0; i < items.length; i++) {
            await OrderDetail.create({
                quantity: items[i]?.quantity,
                productId: items[i]?.productId,
                orderId: orderData.id
            })
        }
        if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
            //khalti integration
            const data = {
                return_url: "http://localhost:5173/success/",
                purchase_order_id: orderData.id,
                amount: totalAmount * 100,
                website_url: "http://localhost:5173/",
                purchase_order_name: "orderName_" + orderData.id

            }
            const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
                headers: {
                    "Authorization": 'key a927bd3c9fec48268d2b790fa9e38775'
                }
            })
            const khaltiResponse: KhaltiResponse = response.data
            paymentData.pidx = khaltiResponse.pidx
            await paymentData.save()
            res.status(200).json({
                message: "order placed successfully",
                url: khaltiResponse.payment_url
            })
        } else {
            res.status(200).json({
                message: "Order placed successfully"
            })
        }
    }

    async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
        const { pidx } = req.body

        if (!pidx) {
            res.status(400).json({
                message: "Please provide pidx"
            })
            return
        }
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", { pidx }, {
            headers: {
                "Authorization": 'key a927bd3c9fec48268d2b790fa9e38775'
            }
        })
        const data: TransactionVerificationResponse = response.data
        console.log(data)
        if (data.status === TransactionStatus.Completed) {
            await Payment.update({ paymentStatus: 'paid' }, {
                where: {
                    pidx: pidx
                }
            })
            res.status(200).json({
                message: "Payment verified successfully"
            })
        } else {
            res.status(200).json({
                message: "Payment not verified"
            })
        }
    }
    //CUSTOMER SIDE START
    async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id
        const orders = await Order.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Payment
                }
            ]
        })
        if (orders.length > 0) {
            res.status(200).json({
                message: "Orders fetched successfully",
                data: orders
            })
        } else {
            res.status(404).json({
                message: "You haven't ordered anyrthing yet...",
                data: []
            })
        }
    }
    async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
        const orderId = req.params.id
        const orderDetails = await OrderDetail.findAll({
            where: {
                orderId
            },
            include: [
                {
                    model: Product
                }
            ]
        })
        if (orderDetails.length > 0) {
            res.status(200).json({
                message: "Orders fetched successfully",
                data: orderDetails
            })
        } else {
            res.status(404).json({
                message: "You haven't ordered anyrthing yet...",
                data: []
            })
        }
    }
    async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id
        const orderId = req.params.id
        const order: any = await Order.findAll({
            where: {
                userId,
                id: orderId
            },
            include: []
        })
        if (order?.OrderStatus === Orderstatus.Ontheway || order?.OrderStatus === Orderstatus.Preparation) {
            res.status(400).json({
                message: "Order cannot be cancelled at this stage"
            })
            return
        }
        await Order.update({ orderStatus: Orderstatus.Cancelled }, {
            where: {
                id: orderId
            }
        })
        res.status(200).json({
            message: "Order cancelled successfully"
        })
    }
    //CUSTOMER SIDE END HERE

    //ADMIN SIDE START HERE
    async changeOrderStatus(req: Request, res: Response): Promise<void> {
        const orderId = req.params.id  //kasko change garni?
        const Orderstatus: Orderstatus = req.body.orderstatus  // k ma change garni?
        await Order.update({
            orderStatus: Orderstatus
        }, {
            where: {
                id: orderId
            }
        })
        res.status(200).json({
            message: "Order status updated successfully"
        })
    }

    async changePaymentStatus(req: Request, res: Response): Promise<void> {
        const orderId:any = req.params.id
        const paymentStatus: PaymentStatus = req.body.paymentStatus
        const order = await Order.findByPk(orderId)

        const extendedOrder: ExtenedOrder = order as ExtenedOrder
        await Payment.update(
            {
                paymentStatus: paymentStatus
            }, {
            where: {
                id: extendedOrder.paymentId
            }
        })
        res.status(200).json({
            message: `Payment status of orderId ${orderId} updated to ${paymentStatus} successfully`
        })
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        const orderId:any = req.params.id
        const order = await Order.findByPk(orderId)
        const extendedOrder: ExtenedOrder = order as ExtenedOrder
        if (order) {          
            await OrderDetail.destroy({
                where: {
                    orderId: orderId
                }
            })
            await Payment.destroy({
                where: {
                    id: extendedOrder.paymentId
                }
            })
              await Order.destroy({
                where: {
                    id: orderId
                }
            })
            res.status(200).json({
                message: "Order deleted successfully"
            })
        }else{
            res.status(404).json({
                message: "No Order with that orderId"
            })
        }

    }
}
export default new OrderController