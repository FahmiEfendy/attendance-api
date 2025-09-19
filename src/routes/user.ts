import bcrypt = require("bcrypt");
import express = require("express");

const db = require("../../models");
const { UserRole } = require("../enum/role");
const { authorize } = require("../middleware/authMiddleware");
const { allUserSchema, userDetailSchema } = require("../utils/userValidator");

const router = express.Router();

type Request = express.Request;
type Response = express.Response;

// TODO: fix any
router.get(
  "/",
  authorize([UserRole.ADMIN, UserRole.HR]),
  async (req: any, res: Response) => {
    try {
      const { error, value } = allUserSchema.validate(req.query);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { role, department, position } = value;

      const filter: { role?: string; department?: string; position?: string } =
        {};
      if (role) filter.role = role;
      if (department) filter.department = department;
      if (position) filter.position = position;

      const allUsers = await db.User.findAll({ where: filter });

      return res.status(200).json({
        message: "Success get all users",
        allUsers,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/:id",
  authorize([UserRole.ADMIN, UserRole.HR], true),
  async (req: any, res: Response) => {
    try {
      const { error, value } = userDetailSchema.validate(req.params);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { id } = value;

      const selectedUser = await db.User.findOne({ where: { id } });
      if (!selectedUser) {
        return res.status(404).send({ message: "User not found!" });
      }

      return res.status(200).json({
        message: "Success get a user",
        selectedUser,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.patch(
  "/:id",
  authorize([UserRole.ADMIN, UserRole.HR]),
  async (req: any, res: Response) => {
    try {
      const { error, value } = userDetailSchema.validate(
        {
          ...req.params,
          ...req.body,
        },
        { allowUnknown: true } // Fix not allowed attr
      );

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { id, password, full_name, phone, department, position } = value;

      const user = await db.User.findOne({ where: { id } });
      if (!user) {
        res.status(404).send({ message: "User not found!" });
      }

      if (password) {
        const hashedNewPassowrd = await bcrypt.hash(password, 10);
        user.set("password", hashedNewPassowrd);
      }

      if (full_name) user.set("full_name", full_name);
      if (phone) user.set("phone", phone);
      if (department) user.set("department", department);
      if (position) user.set("position", position);

      await user.save();

      return res.json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/:id",
  authorize([UserRole.ADMIN, UserRole.HR]),
  async (req: any, res: Response) => {
    try {
      const { error, value } = userDetailSchema.validate(req.params);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { id } = value;

      const user = await db.User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await db.User.destroy({ where: { id } });

      return res.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
