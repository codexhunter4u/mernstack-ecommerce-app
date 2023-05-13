import JWT from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Access denied. Sign in required",
      error: error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(200).send({
        success: false,
        message: "UnAuthorized access",
      });
    } else {
      next();
    }
  } catch (error) {}
};
