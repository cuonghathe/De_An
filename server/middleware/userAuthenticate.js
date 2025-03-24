import userDB from "../models/users/userModel.js";
import jwt from "jsonwebtoken";
import res from "express";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const userAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    const verifyToken = jwt.verify(token, SECRET_KEY);

    const rootUser = await userDB.findOne({_id:verifyToken._id});
    console.log("rootUser:",rootUser);

    if(!rootUser){
        throw new Error("Tài khoản không tồn tại");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    req.userMainID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).json({ error: "Hãy đăng nhập" });
  }
}

export default userAuthenticate;
