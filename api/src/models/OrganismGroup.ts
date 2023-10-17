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
import { Organism } from "./Organism";
import { Ticket } from "./Ticket";

export class OrganismGroup extends Model<
  InferAttributes<OrganismGroup>,
  InferCreationAttributes<OrganismGroup>
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
  declare getOrganisms: HasManyGetAssociationsMixin<Organism>; // Note the null assertions!
  declare countOrganisms: HasManyCountAssociationsMixin;
  declare hasOrganism: HasManyHasAssociationMixin<Organism, Organism["id"]>;
  declare hasOrganisms: HasManyHasAssociationsMixin<Organism, Organism["id"]>;
  declare setOrganisms: HasManySetAssociationsMixin<Organism, Organism["id"]>;
  declare addOrganism: HasManyAddAssociationMixin<Organism, Organism["id"]>;
  declare addOrganisms: HasManyAddAssociationsMixin<Organism, Organism["id"]>;
  declare removeOrganism: HasManyRemoveAssociationMixin<
    Organism,
    Organism["id"]
  >;
  declare removeOrganisms: HasManyRemoveAssociationsMixin<
    Organism,
    Organism["id"]
  >;
  declare createOrganism: HasManyCreateAssociationMixin<
    Organism,
    "organismGroupId"
  >;

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
  declare organisms?: NonAttribute<Organism[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    organisms: Association<OrganismGroup, Organism>;
    tickets: Association<OrganismGroup, Ticket>;
  };
}

OrganismGroup.init(
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
      singular: "organismGroup",
      plural: "organismGroups",
    },
    tableName: "organismGroups",
    paranoid: true,
  }
);
