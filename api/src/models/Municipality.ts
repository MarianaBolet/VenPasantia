import {
  Association,
  DataTypes,
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
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { Parish } from "./Parish";
import { Ticket } from "./Ticket";

export class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getParishes: HasManyGetAssociationsMixin<Parish>; // Note the null assertions!
  declare countParishes: HasManyCountAssociationsMixin;
  declare hasParish: HasManyHasAssociationMixin<Parish, Parish["id"]>;
  declare hasParishes: HasManyHasAssociationsMixin<Parish, Parish["id"]>;
  declare setParishes: HasManySetAssociationsMixin<Parish, Parish["id"]>;
  declare addParish: HasManyAddAssociationMixin<Parish, Parish["id"]>;
  declare addParishes: HasManyAddAssociationsMixin<Parish, Parish["id"]>;
  declare removeParish: HasManyRemoveAssociationMixin<Parish, Parish["id"]>;
  declare removeParishes: HasManyRemoveAssociationsMixin<Parish, Parish["id"]>;
  declare createParish: HasManyCreateAssociationMixin<Parish, "municipalityId">;

  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "municipalityId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare parishes?: NonAttribute<Parish[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    parishes: Association<Municipality, Parish>;
    tickets: Association<Municipality, Ticket>;
  };
}

Municipality.init(
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
      singular: "municipality",
      plural: "municipalities",
    },
    tableName: "municipalities",
    paranoid: true,
  }
);
