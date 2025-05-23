import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userUpload from '../../Config/userConfig/userConfig.js';
import userAuthController from '../../controllers/users/usersControllers.js';
import userAuthenticate from "../../middleware/userAuthenticate.js";

const router = express.Router();

// kiem tra thu muc uploads co ton tai khong
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


//xác thực người dùng
router.post("/register",userUpload.single("userprofile"), userAuthController.register);
router.post("/login",userAuthController.login);
router.post("/forgotpassword",userAuthController.forgotpassword);
router.get("/getuserrecipe/:userId", userAuthController.getUserRecipe);
router.get("/getuserreview/:userId", userAuthController.getUserReview);
router.get("/profile/:userId", userAuthController.getUser);
router.delete("/delprofile/:userId", userAuthController.deleteUser);
router.put("/updateprofile/:userId", userUpload.single("userprofile"), userAuthController.updateUser);
router.get("/alluserstats", userAuthController.getUserRecipeStats);


// xác minh người dùng
router.get("/userloggedin", userAuthenticate,userAuthController.userVerify);

export default router;

