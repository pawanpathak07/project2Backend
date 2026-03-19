import OrderDetail from "../database/models/OrderDetail"


export interface OrderData{
    phoneNumber : string,
    shippingAddress : string,
    totalAmount : number,
    paymentDetails : {
        paymentMethod : PaymentMethod,
        paymentStatus? : PaymentStatus,
        pidx?:string
    },
    items : OrderDetail[]
}

export interface OrderDetails{
    quantity : number,
    productId : string
}
export enum PaymentMethod{
    Cod = "Cash on Delivery",
    Khalti = "Khalti",
}
enum PaymentStatus{
    Paid = "Paid",
    Unpaid = "Unpaid"
}