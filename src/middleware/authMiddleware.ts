import express = require("express");
import jwt = require("jsonwebtoken");

const { UserRole } = require("../enum/role");

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

interface AuthRequest extends Request {
  userData?: any;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorize =
  (roles: (typeof UserRole)[] = [], isAllowSelf = false) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.userData?.role;
    const userId = req.userData?.id;
    const targetId = req.params?.id;

    // Allow selected roles
    if (roles.includes(userRole)) {
      return next();
    }

    // Allow self-access
    if (isAllowSelf && userId === targetId) {
      return next();
    }

    return res
      .status(401)
      .json({ message: "You have no access to view this resource!" });
  };

module.exports = { authenticate, authorize };
