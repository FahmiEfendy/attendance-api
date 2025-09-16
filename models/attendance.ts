"use strict";

const { DataTypes, Model } = require("sequelize");

import type types = require("sequelize");

interface AttendanceAttributes {
  id: string;
  user_id: string;
  date: string;
  time_in: string;
  time_out?: string;
  photo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AttendanceCreationAttributes
  extends types.Optional<AttendanceAttributes, "id"> {}

module.exports = (sequelize: types.Sequelize, dataTypes: typeof DataTypes) => {
  class Attendance
    extends Model<AttendanceAttributes, AttendanceCreationAttributes>
    implements AttendanceAttributes
  {
    public id!: string;
    public user_id!: string;
    public date!: string;
    public time_in!: string;
    public time_out?: string;
    public photo_url?: string;
    public created_at?: Date;
    public updated_at?: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      date: DataTypes.DATE,
      time_in: DataTypes.TIME,
      time_out: DataTypes.TIME,
      photo_url: DataTypes.STRING(50),
    },
    {
      sequelize,
      tableName: "attendance",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Attendance;
};
