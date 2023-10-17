import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { Ticket } from "./Ticket";

export class Reason extends Model<
  InferAttributes<Reason>,
  InferCreationAttributes<Reason>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;
  declare priority?: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "reasonId">;

  // You can also pre-declare possible inclusions, these will only be populated
  // if you actively include a relation.
  declare tickets?: NonAttribute<Ticket[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    tickets: Association<Reason, Ticket>;
  };
}

Reason.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    name: {
      singular: "reason",
      plural: "reasons",
    },
    paranoid: true,
    tableName: "reasons",
  }
);
