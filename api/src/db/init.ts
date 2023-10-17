import sequelize from "./config";
import initAssociations from "./associations";
import { Role } from "../models/Role";
import { User } from "../models/User";

const { ADMIN_USER, ADMIN_PASSWORD } = process.env;

// Test function to check the connectivity to the database.
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    initAssociations();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const startDbForce = async () => {
  checkConnection().then(async () => {
    console.log(
      "Force DB start scheduled - Wiping DB and creating default roles"
    );
    await sequelize.sync({ force: true });
    const adminRole = await Role.create({ id: 1, name: "admin" });
    await Role.create({ id: 2, name: "supervisor" });
    await Role.create({ id: 3, name: "dispatcher" });
    await Role.create({ id: 4, name: "operator" });

    const adminUser = await User.create({
      username: ADMIN_USER || "admin",
      fullname: "Administrador del Sistema",
      password: ADMIN_PASSWORD || "password",
    });

    adminRole.addUser(adminUser);

    console.log("Roles and Admin User created.");
  });
};

export const startDbNormal = async () => {
  checkConnection().then(async () => {
    console.log("Normal DB start scheduled");
    await sequelize.sync({ alter: true });
  });
};
