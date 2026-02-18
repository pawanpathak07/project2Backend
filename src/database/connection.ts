import { ForeignKey, Sequelize } from "sequelize-typescript";
import User from "./models/User";
import Product from "./models/Product";
import Category from "./models/Category";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const sequelize = new Sequelize({
  database: required("DB_NAME"),
  username: required("DB_USERNAME"),
  password: process.env.DB_PASSWORD ?? "",
  host: required("DB_HOST"),
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
  //  models: [User, Product, Category],

});

sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(err));

sequelize.sync({ force : false }).then(() => 
    console.log("Database synced successfully"
 ));

 //Relationships

User.hasMany(Product, { foreignKey: "userId" })
Product.belongsTo(User, { foreignKey: "userId" })

Category.hasOne(Product, { foreignKey: "categoryId" })
Product.belongsTo(Category, { foreignKey: "categoryId" })



export default sequelize;
