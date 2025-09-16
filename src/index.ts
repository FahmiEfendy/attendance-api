import dotenv = require("dotenv");
import express = require("express");

const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");

type Request = express.Request;
type Response = express.Response;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);

app.listen(PORT, () =>
  console.log(`Server running at port http://localhost:${PORT}`)
);
