import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt
} from "sequelize-typescript";

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true
})
