import userModel from "../models/userModel.js";
import uploadOncloudinary from "../utils/cloudinary.js"
import encryptPassword from "../utils/encryptPassword.js";
import { isValid, isValidEmail, isValidNumber, isValidPassword, isValidPincode, isValidRequestBody, nameFormet } from "../utils/validation.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const data=req.body
    const {fname,lname,email,phone,password,address,profileImage}=data
    if(!isValidRequestBody(data)){
      return res.status(400).send({ status: false, msg: "Please provide details" })
    }
    if (!isValid(fname)){
      return res.status(400).send({ status: false, message: "First name is required" })
    }
    if (!nameFormet(fname)) {
      return res.status(400).send({ status: false, message: "First name start with capital letter" })
    }
    if (!isValid(lname)){
      return res.status(400).send({ status: false, message: "Last name is required" })
    }
    if (!nameFormet(fname)){
      return res.status(400).send({ status: false, message: "Last name start with capital letter" })
    }
    if (!isValid(email)){
      return res.status(400).send({ status: false, message: "Email is required " })
    }
    if (!isValidEmail(email)){
      return res.status(400).send({ status: false, message: "Email is not valid" })
    }

   const existingUser=await userModel.findOne({$or:[{ email },{ phone }]})

   if(existingUser){
      return res.status(409).send({status:false,message:"User Already Registerd"})
   }
   if (!isValid(password)){
    return res.status(400).send({ status: false, message: "Password is required " })
   }
   if (!isValidPassword(password)){
    return res.status(400).send({ status: false, message: "Password length should be 8 to 15 digits and enter atleast one uppercase or lowercase" })
   }

   if (!isValid(phone)){
    return res.status(400).send({ status: false, message: "Phone number is required " })
   }

  if (!isValidNumber(phone)){
    return res.status(400).send({ status: false, message: "Phone number should be 10 digit" })
  }

  if (!address){
    return res.status(400).send({ status: false, msg: "Address is requried" })
  }
// *******************************ADDRESS-SHIPPING**************************************************

  if (address) {
    if (!isValid(data.address.shipping.street)){
      return res.status(400).send({ status: false, message: "Shipping Address field is required " })
    }
    if (!isValid(data.address.shipping.city)){
      return res.status(400).send({ status: false, message: "City field is required " })
    }
    if (!isValid(data.address.shipping.pincode)){
      return res.status(400).send({ status: false, message: "Pincode field is required " })
    }
    if (!isValidPincode(data.address.shipping.pincode)){
      return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })
    }
// *******************************ADDRESS-BILLING**************************************************
    if(!data.address.billing){
      return res.status(400).send({status:false, message:" Billing Address is required"})
    }
    if (!isValid(data.address.billing.street)){
      return res.status(400).send({ status: false, message: "Street field is required " })
    }
    if (!isValid(data.address.billing.city)){
      return res.status(400).send({ status: false, message: "City field is required " })
    }
    if (!isValid(data.address.billing.pincode)){
      return res.status(400).send({ status: false, message: "Pincode field is required " })
    }
    if (!isValidPincode(data.address.billing.pincode)){
      return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })
    }
  }

  if (profileImage==""){
    return res.status(400).send({status:false, message:"Please provide profileimage"})
  }
   const profilePath=req.file.path
  //  console.log(profilePath);
   if(!profilePath){
    return res.send(400).send({status:false,message:"profile is required"})
   }
   const profile=await uploadOncloudinary(profilePath)
  //  console.log(profile);
   if(!profile){
    return res.send(400).send({status:false,message:"profile is required"})
   }
   const hashedPassword=await encryptPassword(password)
   const user=await userModel.create({fname,lname,email,phone,password:hashedPassword,address,profile:profile.url ,profileImage:profile.url})
   res.status(201).send({status:true,data:user})
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};


