import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    tableName: "orders",
    modelName: "Order",
    timestamps: true
})

class Order extends Model {
    @Column({
        primaryKey : true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id:string;

    @Column({
        type: DataType.STRING,
        allowNull : false  
    })
    declare phoneNumber:string; 

    @Column({
        type: DataType.STRING,
        allowNull : false  
    })
    declare skippingAddress:string; 
     
    @Column({
        type: DataType.FLOAT,
        allowNull : false  
    })
    declare totalAmount:number;

    @Column({
        type: DataType.ENUM('pending', 'delivered', 'cancelled', 'ontheway', 'preparation'),
        defaultValue : 'pending' 
    })
    declare orderStatus:number; 
}

export default Order