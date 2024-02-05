import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOncloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null;
    const response=await cloudinary.uploader.upload(LocalFilePath,{resource_type:"image"})
    console.log("file is uplaod on cloudinary",response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(LocalFilePath) //removed locally saved temporary file when it failed on upload
    return null;
  }
};

export default uploadOncloudinary;