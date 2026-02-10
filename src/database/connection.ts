import { Sequelize } from "sequelize-typescript";

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
});

sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(err));

sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"));

export default sequelize;
