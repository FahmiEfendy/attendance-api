"use strict";

const { DataTypes, Model } = require("sequelize");

import type types = require("sequelize");

interface UserAttributes {
  id: string;
  username: string;
  password: string;
  role: "employee" | "hr";
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends types.Optional<UserAttributes, "id"> {}

module.exports = (sequelize: types.Sequelize, dataTypes: typeof DataTypes) => {
  class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
  {
    public id!: string;
    public username!: string;
    public password!: string;
    public role!: "employee" | "hr";
    public full_name!: string;
    public email!: string;
    public phone!: string;
    public department!: string;
    public position!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM("employee", "hr"),
        defaultValue: "employee",
      },
      full_name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20) },
      department: { type: DataTypes.STRING(100) },
      position: { type: DataTypes.STRING(100) },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
