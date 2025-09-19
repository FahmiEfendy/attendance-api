import bcrypt = require("bcrypt");
import express = require("express");
import jwt = require("jsonwebtoken");
import Sequelize = require("sequelize");

const db = require("../../models");
const { loginSchema, registerSchema } = require("../utils/authValidator");

const router = express.Router();

type Request = express.Request;
type Response = express.Response;

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      username,
      password,
      role,
      full_name,
      email,
      phone,
      department,
      position,
    } = value;

    const isUserExist = await db.User.findOne({
      where: { username },
    });

    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "User with that username or email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.User.create({
      username,
      password: hashedPassword,
      role,
      full_name,
      email,
      phone,
      department,
      position,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    const findUser = await db.User.findOne({ where: { username } });
    const selectedUser = findUser?.dataValues;
    if (!selectedUser) {
      return res.status(404).json({ message: "User didn't exist!" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      selectedUser.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      {
        id: selectedUser.id,
        username: selectedUser.username,
        full_name: selectedUser.full_name,
        role: selectedUser.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "5d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
