import { Sequelize } from "sequelize";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

export default new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: parseInt(DB_PORT as string),
    dialect: "postgres",
    ssl: true,
    timezone: "-04:00",
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
