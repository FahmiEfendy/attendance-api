import dayjs = require("dayjs");
import multer = require("multer");
import express = require("express");
import Sequelize = require("sequelize");
import utc = require("dayjs/plugin/utc");
import timezone = require("dayjs/plugin/timezone");

const db = require("../../models");
const { UserRole } = require("../enum/role");
const { authorize } = require("../middleware/authMiddleware");
const {
  saveUploadedFile,
  deleteUploadedFile,
} = require("../../utils/fileUpload");

const router = express.Router();

dayjs.extend(utc);
dayjs.extend(timezone);

type Request = express.Request;
type Response = express.Response;

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      const isUserExist = await db.User.findOne({
        where: {
          id: user_id,
        },
      });
      if (!isUserExist) {
        return res
          .status(400)
          .json({ message: "User with that id not exists!" });
      }

      // Find today’s attendance
      const todayStart = dayjs().tz("Asia/Jakarta").startOf("day").toDate();
      const todayEnd = dayjs().tz("Asia/Jakarta").endOf("day").toDate();
      const attendance = await db.Attendance.findOne({
        where: {
          user_id,
          date: {
            [Sequelize.Op.between]: [todayStart, todayEnd], // check between 00:00 and 23:59
          },
        },
      });

      const today = dayjs().tz("Asia/Jakarta");
      if (!attendance) {
        // Check-in
        const photoPath = saveUploadedFile(req.file);

        const newAttendance = await db.Attendance.create({
          user_id,
          date: today.format("YYYY-MM-DD"),
          time_in: today.format("HH:mm:ss"),
          photo_in_url: photoPath,
        });

        return res.json({
          message: "Success checked in",
          attendance: newAttendance,
        });
      } else if (!attendance.dataValues.time_out) {
        // Check-out
        const photoPath = saveUploadedFile(req.file);

        attendance.set("time_out", today.format("HH:mm:ss"));
        attendance.set("photo_out_url", photoPath);
        await attendance.save();

        return res.json({
          message: "Success checked out",
          attendance,
        });
      } else {
        return res.status(400).json({ message: "Already checked out today" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/",
  authorize([UserRole.ADMIN, UserRole.HR]),
  async (req: any, res: Response) => {
    try {
      const attendances = await db.Attendance.findAll();
      return res.json({ message: "Success get all attendances", attendances });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/me",
  authorize([UserRole.ADMIN, UserRole.HR], true),
  async (req: any, res: Response) => {
    try {
      const { user_id } = req.body;

      const selectedUser = await db.User.findOne({
        where: {
          id: user_id,
        },
      });
      if (!selectedUser) {
        return res
          .status(400)
          .json({ message: "User with that id not exists!" });
      }

      const userAttendace = await db.Attendance.findAll({ where: { user_id } });
      return res.json({
        message: "Success get all attendances",
        userAttendace,
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
      const { id } = req.params;

      const attendanceDetail = await db.Attendance.findOne({ where: id });
      return res.json({
        message: "Success get attendance detail",
        attendanceDetail,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.patch(
  "/:id",
  upload.single("photo"),
  authorize([UserRole.ADMIN, UserRole.HR]),
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { time_in, time_out, date } = req.body;
      let errorMessage = "";

      const attendance = await db.Attendance.findOne({ where: { id } });
      if (!attendance) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      if (date) {
        attendance.set("date", date);
      }

      if (time_in) {
        if (time_in > attendance.dataValues.time_out) {
          errorMessage = "New time_in cannot be older than time_out";
        } else {
          attendance.set("time_in", time_in);
        }
      }

      if (time_out) {
        if (time_out < attendance.dataValues.time_in) {
          errorMessage = "New time_out cannot be earlier than time_in";
        } else {
          attendance.set("time_out", time_out);
        }
      }

      if (req.file) {
        deleteUploadedFile(attendance.dataValues.photo_url);
        const photoPath = saveUploadedFile(req.file);
        attendance.set("photo_url", photoPath);
      }

      await attendance.save();

      if (errorMessage) {
        return res.status(400).json({ message: errorMessage });
      } else {
        return res.json({
          message: "Attendance updated successfully",
          attendance,
        });
      }
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
      const { id } = req.params;

      const t = await db.sequelize.transaction();

      const attendance = await db.Attendance.findOne({ where: { id } });
      if (!attendance) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      await db.Attendance.destroy({ where: { id }, transaction: t });
      deleteUploadedFile(attendance.dataValues.photo_in_url);
      deleteUploadedFile(attendance.dataValues.photo_out_url);
      await t.commit(); // Commit delete row if image deleted

      return res.json({
        message: "Attendance deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
