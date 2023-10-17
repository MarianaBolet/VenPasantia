import { Municipality } from "../models/Municipality";
import { Organism } from "../models/Organism";
import { OrganismGroup } from "../models/OrganismGroup";
import { Parish } from "../models/Parish";
import { Quadrant } from "../models/Quadrant";
import { Reason } from "../models/Reason";
import { Role } from "../models/Role";
import { Ticket } from "../models/Ticket";
import { User } from "../models/User";

export default () => {
  // Municipality associations
  Municipality.hasMany(Parish, {
    sourceKey: "id",
    foreignKey: "municipalityId",
    as: "parishes",
  });
  Municipality.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "municipalityId",
    as: "tickets",
  });

  // Organism associations
  Organism.belongsTo(OrganismGroup, {
    foreignKey: "organismGroupId",
    as: "organismGroup",
  });
  Organism.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "organismId",
    as: "tickets",
  });

  // Organism Group associations
  OrganismGroup.hasMany(Organism, {
    sourceKey: "id",
    foreignKey: "organismGroupId",
    as: "organisms",
  });
  OrganismGroup.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "organismGroupId",
    as: "tickets",
  });

  // Parish associations
  Parish.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municipality",
  });
  Parish.hasMany(Quadrant, {
    sourceKey: "id",
    foreignKey: "parishId",
    as: "quadrants",
  });
  Parish.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "parishId",
    as: "tickets",
  });

  // Quadrant associations
  Quadrant.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  Quadrant.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "quadrantId",
    as: "tickets",
  });

  // Reason associations
  Reason.hasMany(Ticket, {
    sourceKey: "id",
    foreignKey: "reasonId",
    as: "tickets",
  });

  // Role associations
  Role.hasMany(User, { sourceKey: "id", foreignKey: "roleId", as: "users" });

  // Ticket associations
  Ticket.belongsTo(Municipality, {
    foreignKey: "municipalityId",
    as: "municipality",
  });
  Ticket.belongsTo(Organism, { foreignKey: "organismId", as: "organism" });
  Ticket.belongsTo(OrganismGroup, {
    foreignKey: "organismGroupId",
    as: "organismGroup",
  });
  Ticket.belongsTo(Parish, { foreignKey: "parishId", as: "parish" });
  Ticket.belongsTo(Quadrant, { foreignKey: "quadrantId", as: "quadrant" });
  Ticket.belongsTo(Reason, { foreignKey: "reasonId", as: "reason" });
  Ticket.belongsToMany(User, {
    sourceKey: "id",
    foreignKey: "ticketId",
    through: "user_tickets",
  });

  // User associations
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  User.belongsToMany(Ticket, {
    sourceKey: "id",
    foreignKey: "userId",
    through: "user_tickets",
  });
};
