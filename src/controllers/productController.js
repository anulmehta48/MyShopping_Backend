import productModel from "../models/productModel.js";
import uploadOncloudinary from "../utils/cloudinary.js";
import { isValid, isValidObjectId, isValidRequestBody, nameFormet, validateSizes } from "../utils/validation.js";

export const createproduct = async (req, res) => {
  try {
    const data=req.body
    if (Object.keys(data).length == 0){
    return res.status(400).send({ status: false, message: "please provide data" });
    }
    const { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data

    if (!isValid(title)){
        return res.status(400).send({ status: false, message: "title is required." });
    }
    if (!nameFormet(title)){
      return res.status(400).send({ status: false, message: "title should be in alphabetical" });
    }
    let checkTitle = await productModel.findOne({ title: title });
    if (checkTitle){
      return res.status(400).send({ status: false, msg: "title already exist" });
    }
    if (!isValid(description)){
      return res.status(400).send({ status: false, message: "description is required." });
    }
    if (!isValid(description)){
      return res.status(400).send({ status: false, message: "description should be in alphabetical" });
    }
    if (!isValid(price)){
      return res.status(400).send({ status: false, message: "price is required." });
    }
    if (!/^[0-9 .]+$/.test(price)){
      return res.status(400).send({ status: false, message: "price must be in numeric" })
    }
    if (!currencyId ){
      return res.status(400).send({ status: false, message: "currency is required" });
    }
    if (currencyId !== "INR" ){
      return res.status(400).send({ status: false, message: "enter INR currency only" });
    }
    if (!currencyFormat){
      return res.status(400).send({ status: false, message: "currency format required" });
    }
    if (currencyFormat !== "₹"){
      return res.status(400).send({ status: false, message: "enter indian currency format i.e '₹' " });
    }
    if (!style){
      return res.status(400).send({ status: false, message: "enter styles" });
    }
    if(!availableSizes){
      return res.status(400).send({status:false,message:"Please give available size of product"})
    }
    const validation = validateSizes(availableSizes);
    if (!validation.validate) {
      return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS' || 'M' || 'X' || 'L' || 'XXL' || 'XL']` });
    }
    data.availableSizes = validation.sizeArray
    if(installments){
      if (isNaN(installments)){
        return res.status(400).send({ status: false, message: "installments should be number only" })
      }
    }
    if (!req.file){
      return res.status(400).send({status:false, message:"Please select product image"})
    }
    const productPath=req.file.path
    if(!productPath){
      return res.send(400).send({status:false,message:"product path is required"})
    }
    const product=await uploadOncloudinary(productPath)
    if(!product){
      return res.send(400).send({status:false,message:"product link is required"})
    }
    data['productImage'] = product.url
    const createdproduct = await productModel.create(data)
    return res.status(201).send({ status: true, message: "Success", data: createdproduct })
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

export const getproduct=async (req,res)=>{
  try {
    const productId = req.params.productId
    if (!isValidObjectId(productId)){
      return res.status(400).send({ status: false, message: "Provide valid product id" })
    } 
    const productDetails = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!productDetails){
     return res.status(404).send({ status: false, msg: "product is not found" })
    }
    return res.status(200).send({ status: true, message: "Success", data: productDetails })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

export const updateProduct = async function (req, res) {
  try {
    const productId = req.params.productId;
    const data = req.body;
   
    if (!isValidObjectId(productId)){
      return res.status(400).send({ status: false, message: "Provide valid product id" })
    } 
    const productDetails = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!productDetails){
      return res.status(404).send({ status: false, msg: "product is not found" })
    }
    const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, isDeleted } = data
  
    if (Object.keys(data).length == 0){
      return res.status(400).send({ status: false, message: "please provide data" });
    } 
    if (title){
      if (!isValid(title)) {
        return res.status(400).send({ status: false, message: "can't empty title field" })
      }
      if (!nameFormet(title)){
        return res.status(400).send({ status: false, message: "title  must be alphabetic characters" })
      }
      let isTitlePresent = await productModel.findOne({ title })
      if (isTitlePresent) {
          return res.status(400).send({ status: false, message: "title is already present" })
      }
    }
  
    if (description){
      if (!isValid(description)){
        return res.status(400).send({ status: false, message: "description  must be alphabetic characters" })
      } 
    }
    if (price){
      if (!/^[0-9 .]+$/.test(price)){
        return res.status(400).send({ status: false, message: "price must be in numeric" })
       }
    }
    if (currencyId){
      if (currencyId != "INR"){
        return res.status(400).send({ status: false, message: "currency Id must be INR" })
      }
    }
    if (currencyFormat){
      if(currencyFormat != "₹") {
        return res.status(400).send({ status: false, message: "currency formet must be ₹ " })
      }
    }
    if(style){
      if(!isValid(style)) {
        return res.status(400).send({ status: false, message: "style must be alphabetic characters" })
      }
    }
    if (isFreeShipping){
      if (!typeof (isFreeShipping) == Boolean) {
        return res.status(400).send({ status: false, message: "isFreeShipping must be  Boolean" })
      }
    }
    if (isDeleted){
      return res.status(400).send({ status: false, message: "can't update isDeleted field" })
    }
    if(availableSizes){
      const validation = validateSizes(availableSizes);
      if (!validation.validate) {
        return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS' || 'M' || 'X' || 'L' || 'XXL' || 'XL']` });
      }
      data.availableSizes = validation.sizeArray
    }
    if(installments){
      if (isNaN(installments)){
        return res.status(400).send({ status: false, message: "installments should be number only" })
      }
    }
    if (req.file) {
      const productPath = req.file.path;
      if (!productPath) {
        return res.status(400).send({ status: false, message: "Profile path is required" });
      }
      const productlink = await uploadOncloudinary(productPath);
      if (!productlink) {
        return res.status(400).send({ status: false, message: "Profile link is required" });
      }
      data.productImage = productlink.url;
    }
    const updatedData = await productModel.findOneAndUpdate({ _id: productId }, data, { new: true });
    return res.status(200).send({ status: true, message: "product details updated", data: updatedData, });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

export const deleteproduct = async function (req, res) {
  try {
    const productId = req.params.productId

    if (!isValidRequestBody(productId)){
      return res.status(400).send({ status: false, message: "check productId...." })
    }
    const check = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!check) {
      return res.status(404).send({ status: false, message: "product not found" })
    }
    let deletes = await productModel.findOneAndUpdate({_id: productId}, {$set: {isDeleted: true,deletedAt: Date.now()}}, {new: true})
    return res.status(200).send({ status: true, message: "product Deleted Successfully....." })

  } catch (error) {
    return res.status(500).send({status: false,message: error.message})
  }
}

