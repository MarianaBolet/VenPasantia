import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
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
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { Ticket } from "./Ticket";
import { Municipality } from "./Municipality";
import { Quadrant } from "./Quadrant";

export class Parish extends Model<
  InferAttributes<Parish>,
  InferCreationAttributes<Parish>
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

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare municipalityId: ForeignKey<Municipality["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare municipality?: NonAttribute<Municipality>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMunicipality: BelongsToGetAssociationMixin<Municipality>;
  declare setMunicipality: BelongsToSetAssociationMixin<
    Municipality,
    Municipality["id"]
  >;
  declare createMunicipality: BelongsToCreateAssociationMixin<Municipality>;

  declare getQuadrants: HasManyGetAssociationsMixin<Quadrant>; // Note the null assertions!
  declare countQuadrants: HasManyCountAssociationsMixin;
  declare hasQuadrant: HasManyHasAssociationMixin<Quadrant, Quadrant["id"]>;
  declare hasQuadrants: HasManyHasAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare setQuadrants: HasManySetAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare addQuadrant: HasManyAddAssociationMixin<Quadrant, Quadrant["id"]>;
  declare addQuadrants: HasManyAddAssociationsMixin<Quadrant, Quadrant["id"]>;
  declare removeQuadrant: HasManyRemoveAssociationMixin<
    Quadrant,
    Quadrant["id"]
  >;
  declare removeQuadrants: HasManyRemoveAssociationsMixin<
    Quadrant,
    Quadrant["id"]
  >;
  declare createQuadrant: HasManyCreateAssociationMixin<Quadrant, "parishId">;

  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "parishId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare quadrants?: NonAttribute<Quadrant[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    quadrants: Association<Parish, Quadrant>;
    tickets: Association<Parish, Ticket>;
  };
}

Parish.init(
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
      singular: "parish",
      plural: "parishes",
    },
    tableName: "parishes",
    timestamps: false,
    paranoid: true,
  }
);
