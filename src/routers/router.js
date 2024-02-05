import express from "express";
import { createUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send({ message: "My Api Running fine" });
});

router.post("/createuser",upload.single("profileImage"),createUser)

router.all("/*", (req, res) => {
  res.status(400).send({ status: false, message: "Make Sure Your Endpoint is Correct!" });
});

export default router;
