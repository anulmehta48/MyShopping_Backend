import express from "express";
import { createUser, getUserDetails, loginUser, updateUser } from "../controllers/userController.js";
import { uploadProfileImage } from "../middlewares/multer.js";
import { authentication, authorization } from "../middlewares/auth.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send({ message: "My Api Running fine" });
});

router.post("/createuser",uploadProfileImage,createUser)
router.post("/login",loginUser)
router.get("/getuser/:userId",authentication,getUserDetails)
router.put("/updateuser/:userId",authentication,authorization,uploadProfileImage,updateUser)

router.all("/*", (req, res) => {
  res.status(400).send({ status: false, message: "Make Sure Your Endpoint is Correct!" });
});

export default router;
