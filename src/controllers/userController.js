import userModel from "../models/userModel.js";
import uploadOncloudinary from "../utils/cloudinary.js"
import decryptPassword from "../utils/decryptPassword.js";
import encryptPassword from "../utils/encryptPassword.js";
import generateToken from "../utils/generateToken.js";
import { isValid, isValidEmail, isValidNumber, isValidObjectId, isValidPassword, isValidPincode, isValidRequestBody, nameFormet } from "../utils/validation.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const data=req.body
    const {fname,lname,email,phone,password,address}=data
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
    if (!nameFormet(lname)){
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

  if (!req.file){
    return res.status(400).send({status:false, message:"Please select profileimage"})
  }
  const profilePath=req.file.path
  // console.log(profilePath);
   if(!profilePath){
    return res.send(400).send({status:false,message:"profile path is required"})
   }
   const profile=await uploadOncloudinary(profilePath)
  //  console.log(profile);
   if(!profile){
    return res.send(400).send({status:false,message:"profile link is required"})
   }
   const hashedPassword=await encryptPassword(password)
   const user=await userModel.create({fname,lname,email,phone,password:hashedPassword,address,profile:profile.url ,profileImage:profile.url})
   res.status(201).send({status:true,data:user})
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

export const loginUser=async (req,res)=>{
  try {
    const {email,password}=req.body
    if (!isValid(email)){
      return res.status(400).send({ status: false, message: "Email is required " })
    }
    if (!isValidEmail(email)){
      return res.status(400).send({ status: false, message: "Email is not valid" })
    }
    if (!isValid(password)){
      return res.status(400).send({ status: false, message: "Password is required " })
    }
    const user=await userModel.findOne({email:email})
    if(!user){
     return res.status(404).send({status:false,message:"You are not Registered"})
    }
    const matchPassword=await decryptPassword(password,user?.password)
    if(!matchPassword){
     return res.status(401).send({status:false,message:"Please input correct password"})
    }
    const payload={
     id:user?._id.toString(),
     name:user?.fname,
     phone:user?.phone
    }
    const token=await generateToken(payload)
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send({status:true,message:"Login Successfully",token:token})
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ status: false, error: error.message });
  }
}

export const getUserDetails=async (req,res)=>{
  try{
    const userId=req.params.userId
    if (!isValidObjectId(userId)){
     return res.status(400).send({ status: false, message: "User Id is not valid" });
    }
    const userDetails = await userModel.findById({ _id: userId })
    if (!userDetails) { 
      return res.status(404).send({ status: false, message: "User Id does not exist" }) 
    }
    return res.status(200).send({ status: true, message: "User profile details", data: userDetails })

  }catch(error){
    res.status(500).send({ status: false, error: error.message });
  }
}

export const updateUser= async (req,res)=>{
  try{
    const userId=req.params.userId
    if (!isValidObjectId(userId)){
     return res.status(400).send({ status: false, message: "User Id is not valid" });
    }

    const { fname, lname, email, password, phone, address } = req.body;
  
    const data = {}
    
    if (!isValidRequestBody(req.body)){
    return res.status(400).send({ status: false, msg: "please provide  details to update" })
    }

    if (fname) {
      if (!isValid(fname)){
        return res.status(400).send({ status: false, message: "First name is required" })
      }
      if (!nameFormet(fname)) {
        return res.status(400).send({ status: false, message: "First name start with capital letter" })
      }
      data.fname = fname
    }
    if (lname) {
      if (!isValid(lname)){
        return res.status(400).send({ status: false, message: "Last name is required" })
      }
      if (!nameFormet(lname)){
        return res.status(400).send({ status: false, message: "Last name start with capital letter" })
      }
      data.lname = lname
    }

    if (email) {
      if (!isValid(email)){
        return res.status(400).send({ status: false, message: "Email is required " })
      }
      if (!isValidEmail(email)){
        return res.status(400).send({ status: false, message: "Email is not valid" })
      }
      let checkEmail = await userModel.findOne({ email: email })
      if (checkEmail) {
        return res.status(409).send({ status: false, msg: "Email already exist" })
      }
      data.email = email
    }

    if (password) {
      if (!isValid(password)){
        return res.status(400).send({ status: false, message: "Password is required or not valid" })
      }
      if (!isValidPassword(password)){
        return res.status(400).send({ status: false, message: "Password length should be 8 to 15 digits and enter atleast one uppercase or lowercase" })
      }
      data.password = password
    }
    if (phone) {
      if (!isValid(phone)){
        return res.status(400).send({ status: false, message: "Phone is required or not valid" })
      }
      if (!isValidNumber(phone)){
        return res.status(400).send({ status: false, message: "Phone number is not valid" })
      }
      let checkPhone = await userModel.findOne({ phone: phone })
      if (checkPhone) {
        return res.status(409).send({ status: false, msg: "Phone already exist" })
      }
      data.phone = phone
    }
    
    if(address){
      if (address.shipping) {
        if (!isValid(data.address.shipping.street)){
          return res.status(400).send({ status: false, message: "Street Address field is required " })
        }
        data.address.shipping.street = address.shipping.street
        if (!isValid(data.address.shipping.city)){
          return res.status(400).send({ status: false, message: "City field is required " })
        }
        data.address.shipping.city = address.shipping.city
        if (!isValid(data.address.shipping.pincode)){
          return res.status(400).send({ status: false, message: "Pincode field is required " })
        }
        if (!isValidPincode(data.address.shipping.pincode)){
          return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })
        }
        data.address.shipping.pincode = address.shipping.pincode
      }

      if(address.billing){
        return res.status(400).send({status:false, message:" Billing Address is required"})
      }
      if (!isValid(data.address.billing.street)){
        return res.status(400).send({ status: false, message: "Street field is required " })
      }
      data.address.billing.street = address.billing.pincode.street
      if (!isValid(data.address.billing.city)){
        return res.status(400).send({ status: false, message: "City field is required " })
      }
      data.address.billing.city = address.billing.pincode.city
      if (!isValid(data.address.billing.pincode)){
        return res.status(400).send({ status: false, message: "Pincode field is required " })
      }
      if (!isValidPincode(data.address.billing.pincode)){
        return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })
      }
      data.address.billing.pincode = address.billing.pincode
    }

    if (req.file) {
      const profilePath = req.file.path;
      if (!profilePath) {
        return res.status(400).send({ status: false, message: "Profile path is required" });
      }
      const profile = await uploadOncloudinary(profilePath);
      if (!profile) {
        return res.status(400).send({ status: false, message: "Profile link is required" });
      }
      data.profileImage = profile.url;
    }

    if(password){
      const hashedPassword=await encryptPassword(password)
      data.password=hashedPassword
    }
    const updatedUser = await userModel.findOneAndUpdate({_id: userId}, {$set: data}, {new: true})
    return res.status(200).send({ status: true, message: "user Updated successfully", data: updatedUser })

  }catch(error){
    res.status(500).send({ status: false, error: error.message });
  }
}
