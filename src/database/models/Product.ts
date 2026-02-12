import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt
} from "sequelize-typescript";

@Table({
    tableName: "products",
    modelName: "Product",
    timestamps: true
})

class Product extends Model {
    @Column({
        primaryKey : true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id:string;

    @Column({
        type: DataType.STRING
    })
    declare productname:string;

    @Column({
        type: DataType.STRING
    })
    declare email:string;

    @Column({
        type: DataType.STRING
    })
    declare password:string 
}
export default Product;