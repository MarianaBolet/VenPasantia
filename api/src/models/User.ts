import {
  CreationOptional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Association,
} from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../db/config";
import { Ticket } from "./Ticket";
import { Role } from "./Role";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<string>;
  declare username: string;
  declare fullname: string;
  declare password: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  // deletedAt can be undefined during creation (paranoid table)
  declare deletedAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare roleId: ForeignKey<Role["id"]>;

  // `municipality` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare role?: NonAttribute<Role>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getRole: BelongsToGetAssociationMixin<Role>;
  declare setRole: BelongsToSetAssociationMixin<Role, Role["id"]>;
  declare createRole: BelongsToCreateAssociationMixin<Role>;

  declare getTickets: BelongsToManyGetAssociationsMixin<Ticket>;
  declare countTickets: BelongsToManyCountAssociationsMixin;
  declare hasTicket: BelongsToManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: BelongsToManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare setTickets: BelongsToManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: BelongsToManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: BelongsToManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: BelongsToManyRemoveAssociationMixin<
    Ticket,
    Ticket["id"]
  >;
  declare removeTickets: BelongsToManyRemoveAssociationsMixin<
    Ticket,
    Ticket["id"]
  >;
  declare createTicket: BelongsToManyCreateAssociationMixin<Ticket>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare tickets?: NonAttribute<Ticket[]>; // Note this is optional since it's only populated when explicitly requested in code

  public declare static associations: {
    role: Association<User, Role>;
    tickets: Association<User, Ticket>;
  };

  declare validatePassword: NonAttribute<(password: string) => boolean>;
}

const saltRounds = 10;

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        is: /[a-zA-Z0-9]+$/g,
      },
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z\s.]+$/g,
      },
    },
    password: {
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
      singular: "user",
      plural: "users",
    },
    tableName: "users",
    paranoid: true,
  }
);
User.beforeCreate(async (user) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.setDataValue("password", hash);
  } catch (error) {
    console.error(error);
  }
});
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(user.password, salt);
      user.setDataValue("password", hash);
    } catch (error) {
      console.error(error);
    }
  }
});
User.prototype.validatePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};
