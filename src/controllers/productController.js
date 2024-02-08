import productModel from "../models/productModel.js";
import uploadOncloudinary from "../utils/cloudinary.js";
import { isValid, nameFormet, validateSizes } from "../utils/validation.js";

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
};
