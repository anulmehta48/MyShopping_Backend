import userModel from "../models/userModel.js";
import uploadOncloudinary from "../utils/cloudinary.js"
import encryptPassword from "../utils/encryptPassword.js";
 /*
    taking the details from user
    validations -not emplty
    check already -by email or phone number
    check image given or not
    uplaod image on cloudinary 
    create user object- create entery in mongodb
    removed password and and token from created user details
    check for user respoense and return user otherwise send error

     */

// Create a new user
export const createUser = async (req, res) => {
  try {
   const {fname,lname,email,phone,password,address,profileImage}=req.body
   console.log(fname,lname,email,phone,password,address);
   if([fname,lname,email,phone,password,address].some((field)=>field?.trim()==="")){
    return res.status(400).send({status:false,message:"All Fields are required"})
   }

   const existingUser=await userModel.findOne({$or:[{ email },{ phone }]})
   if(existingUser){
    return res.send(409).send({status:false,message:"Uset Already Registerd"})
   }
   const avatarLocalPath=req.files?.profileImage?.path
   console.log(avatarLocalPath);
   if(!avatarLocalPath){
    return res.send(400).send({status:false,message:"Avatar is required"})
   }
   const avatar=await uploadOncloudinary(avatarLocalPath)
   console.log(avatar);
   if(!avatar){
    return res.send(400).send({status:false,message:"Avatar is required"})
   }
   const hashedPassword=await encryptPassword(password)
   const user=await userModel.create({fname,lname,email,phone,password:hashedPassword,address,avatar:avatar.url})
   const createdUser=await userModel.findById(user._id).select("-password")
   if(!createdUser){
    return res.send(500).send({status:false,message:"Internel Server Error"})
   }
   return res.send(201).send({status:true,data:createdUser})
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
};


