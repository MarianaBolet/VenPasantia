import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { User } from "./User";
import { Municipality } from "./Municipality";
import { Organism } from "./Organism";
import { OrganismGroup } from "./OrganismGroup";
import { Parish } from "./Parish";
import { Reason } from "./Reason";
import { Quadrant } from "./Quadrant";
export class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare isOpen: CreationOptional<boolean>;
  declare phone_number?: string;
  declare caller_name?: string;
  declare id_number?: number;
  declare id_type?: "V" | "E" | "J"; // enum type
  declare address?: string;
  declare reference_point?: string;
  declare details?: string;
  declare call_started?: Date;
  declare call_ended?: Date;
  declare dispatch_time?: Date;
  declare arrival_time?: Date;
  declare finish_time?: Date;
  declare dispatch_details?: string;
  declare reinforcement_units?: string;
  declare follow_up?: string;
  declare closing_state?:
    | "Efectiva"
    | "No Efectiva"
    | "Rechazada"
    | "Informativa"
    | "Sabotaje"
    | "Abandonada"; // enum type
  declare closing_details?: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods
  // (like Project.belongsTo) by branding them using the `ForeignKey` type,
  // `Project.init` will know it does not need to display an error if
  // ownerId is missing.
  declare municipalityId: ForeignKey<Municipality["id"]>;
  declare organismId: ForeignKey<Organism["id"]>;
  declare organismGroupId: ForeignKey<OrganismGroup["id"]>;
  declare parishId: ForeignKey<Parish["id"]>;
  declare quadrantId: ForeignKey<Quadrant["id"]>;
  declare reasonId: ForeignKey<Reason["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare municipality?: NonAttribute<Municipality>;
  declare organism?: NonAttribute<Organism>;
  declare organismGroup?: NonAttribute<OrganismGroup>;
  declare parish?: NonAttribute<Parish>;
  declare quadrant?: NonAttribute<Quadrant>;
  declare reason?: NonAttribute<Reason>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare createMunicipality: BelongsToCreateAssociationMixin<Municipality>;
  declare getMunicipality: BelongsToGetAssociationMixin<Municipality>;
  declare setMunicipality: BelongsToSetAssociationMixin<
    Municipality,
    Municipality["id"]
  >;

  declare createOrganism: BelongsToCreateAssociationMixin<Organism>;
  declare getOrganism: BelongsToGetAssociationMixin<Organism>;
  declare setOrganism: BelongsToSetAssociationMixin<Organism, Organism["id"]>;

  declare createOrganismGroup: BelongsToCreateAssociationMixin<OrganismGroup>;
  declare getOrganismGroup: BelongsToGetAssociationMixin<OrganismGroup>;
  declare setOrganismGroup: BelongsToSetAssociationMixin<
    OrganismGroup,
    OrganismGroup["id"]
  >;

  declare createParish: BelongsToCreateAssociationMixin<Parish>;
  declare getParish: BelongsToGetAssociationMixin<Parish>;
  declare setParish: BelongsToSetAssociationMixin<Parish, Parish["id"]>;

  declare createQuadrant: BelongsToCreateAssociationMixin<Quadrant>;
  declare getQuadrant: BelongsToGetAssociationMixin<Quadrant>;
  declare setQuadrant: BelongsToSetAssociationMixin<Quadrant, Quadrant["id"]>;

  declare createReason: BelongsToCreateAssociationMixin<Reason>;
  declare getReason: BelongsToGetAssociationMixin<Reason>;
  declare setReason: BelongsToSetAssociationMixin<Reason, Reason["id"]>;

  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare hasUser: BelongsToManyHasAssociationMixin<User, User["id"]>;
  declare hasUsers: BelongsToManyHasAssociationMixin<User, User["id"]>;
  declare setUsers: BelongsToManySetAssociationsMixin<User, User["id"]>;
  declare addUser: BelongsToManyAddAssociationMixin<User, User["id"]>;
  declare addUsers: BelongsToManyAddAssociationsMixin<User, User["id"]>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, User["id"]>;
  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, User["id"]>;
  declare createUser: BelongsToManyCreateAssociationMixin<User>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    users: Association<Ticket, User>;
  };
}

Ticket.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caller_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_type: {
      type: DataTypes.ENUM("V", "E", "J"),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference_point: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    call_started: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    call_ended: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dispatch_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finish_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dispatch_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reinforcement_units: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    follow_up: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    closing_state: {
      type: DataTypes.ENUM(
        "Efectiva",
        "No Efectiva",
        "Rechazada",
        "Informativa",
        "Sabotaje",
        "Abandonada"
      ),
      allowNull: true,
    },
    closing_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    name: {
      singular: "ticket",
      plural: "tickets",
    },
    tableName: "tickets",
    paranoid: true,
  }
);
