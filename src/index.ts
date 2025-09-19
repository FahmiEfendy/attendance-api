import cors = require("cors");
import dotenv = require("dotenv");
import express = require("express");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const attendanceRoutes = require("./routes/attendance");
const { authenticate } = require("./middleware/authMiddleware");

type Request = express.Request;
type Response = express.Response;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all cors
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);
app.use("/attendance", authenticate, attendanceRoutes);

app.listen(PORT, () =>
  console.log(`Server running at port http://localhost:${PORT}`)
);
