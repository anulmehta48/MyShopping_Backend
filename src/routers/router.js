import express from "express";
import { createUser, getUserDetails, loginUser, updateUser } from "../controllers/userController.js";
import { uploadProductImage, uploadProfileImage } from "../middlewares/multer.js";
import { authentication, authorization } from "../middlewares/auth.js";
import { createproduct, deleteproduct, getproduct, updateProduct } from "../controllers/productController.js";
import { createcart, deletecart, getcart, updatecart } from "../controllers/cartController.js";
import { createorder, updateorder } from "../controllers/orderController.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send({ message: "My Api Running fine" });
});

router.post("/createuser",uploadProfileImage,createUser)
router.post("/login",loginUser)
router.get("/getuser/:userId",authentication,getUserDetails)
router.put("/updateuser/:userId",authentication,authorization,uploadProfileImage,updateUser)

router.post("/createproduct",uploadProductImage,createproduct)
router.get("/getproduct/:productId",getproduct)
router.put("/updateproduct/:productId",uploadProductImage,updateProduct)
router.delete("/deleteproduct/:productId",deleteproduct)

router.post("/createcart/:userId",createcart)
router.put("/updatecart/:userId",updatecart)
router.get("/getcart/:userId",getcart)
router.delete("/deletecart/:userId",deletecart)

router.post("/createorder/:userId",createorder)
router.put("/updateorder/:userId",updateorder)

router.all("/*", (req, res) => {
  res.status(400).send({ status: false, message: "Make Sure Your Endpoint is Correct!" });
});

export default router;

