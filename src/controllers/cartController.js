import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";
import { isValid, isValidObjectId, isValidRequestBody } from "../utils/validation.js";

export const createcart = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const { productId, cartId } = data;
        if(!isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Request body cannot remain empty" });
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: `The given userId: ${userId} is not in proper format` });
        }
        if(!isValid(productId)){
            return res.status(400).send({ status: false, message: "Please provide productId" });
        }
        if(!isValidObjectId(productId)){
            return res.status(400).send({ status: false, message: `The given productId: ${productId} is not in proper format` });
        }
        const findUser = await userModel.findOne({ _id: userId});
        if(!findUser){
            return res.status(404).send({ status: false, message: `User details not found with this provided userId: ${userId}` });
        }
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false });
        if(!findProduct){
            return res.status(400).send({ status: false, message: "Product details are not found please select the product items" });
        }
        const findCart = await cartModel.findOne({ userId: userId });
        if(!findCart){
            const cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: 1
                }],
                totalPrice: findProduct.price,
                totalItems: 1
            };
            const finalCart = await cartModel.create(cartData)
            return res.status(201).send({ status: true, message: "Success", data: finalCart });
        }
        if (findCart) {
            if(!isValid(cartId)){
                return res.status(400).send({ status: false, message: "Please provide cartId" });
            }
            if(!isValidObjectId(cartId)){
                return res.status(400).send({ status: false, message: `The given cartId: ${cartId} is not in proper format` });
            }
            if(findCart._id.toString() != cartId){
                return res.status(400).send({ status: false, message: `cartId provided does not belongs to this user with userId: ${userId}` });
            }
            const array = findCart.items;
            for (let i = 0; i < array.length; i++) {
                if (array[i].productId == productId) {
                    array[i].quantity++;
                    const updatedCart = await cartModel.findOneAndUpdate(
                        { userId: userId },
                        { items: array, totalPrice: findCart.totalPrice + findProduct.price },
                        { new: true })
                    return res.status(201).send({ status: true, message: "Success", data: updatedCart });
                }
            }
            const obj = {}
            obj.productId = findProduct._id,
            obj.quantity = 1,
            findCart.items.push(obj);
            findCart.totalPrice = findCart.totalPrice + findProduct.price;
            findCart.totalItems = findCart.items.length;
            findCart.save();
            return res.status(201).send({ status: true, message: 'Success', data: findCart });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


export const updatecart = async function (req, res) {
    try {
        let userId = req.params.userId
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: `${userId} is invalid` })
        }
        const chekUser = await userModel.findOne({ _id: userId })
        if(!chekUser){
            return res.status(404).send({ status: false, message: "User  not exist" })
        }
        const data = req.body;
        const { cartId, productId, removeProduct } = data;
        if(!isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Request body cannot be empty" })
        }
        if(!isValid(productId)){
            return res.status(400).send({ status: false, message: "Please provide productId" })
        }
        if(!isValidObjectId(productId)){
            return res.status(400).send({ status: false, message: "The given productId is not in proper format" })
        }
        const checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if(!checkProduct){
            return res.status(400).send({ status: false, message: `Product details are not found with this productId: ${productId}, it must be deleted or not exists` });
        }
        if(!isValid(cartId)){
            return res.status(400).send({ status: false, message: "Please provide cartId" })
        }
        if(!isValidObjectId(cartId)){
            return res.status(400).send({ status: false, message:"The given cartId is not in proper format"})
        } 
        const checkCart = await cartModel.findOne({ _id: cartId })
        if(!checkCart){
            return res.status(400).send({ status: false, message: `Cart does not exists with this provided cartId: ${cartId}` })
        }
        if (checkCart.items.length == 0){
            return res.status(400).send({ status: false, message: "You have not added any products in your cart" });
        }
        if (!isValid(removeProduct)){
            return res.status(400).send({ status: false, message: "removeProduct is required" })
        }
        const cart = checkCart.items;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId == productId) {
                const priceChange = cart[i].quantity * checkProduct.price
                if (removeProduct == 0) {
                    const productRemove = await cartModel.findOneAndUpdate({ _id: cartId }, {
                        $pull: { items: { productId: productId } },
                        totalPrice: checkCart.totalPrice, totalItems: checkCart.totalItems
                    }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: productRemove })
                }
                if (removeProduct == 1) {
                    if (cart[i].quantity == 1 && removeProduct == 1) {
                        const priceUpdate = await cartModel.findOneAndUpdate({ _id: cartId }, {
                            $pull: { items: { productId } },
                            totalPrice: checkCart.totalPrice - priceChange, totalItems: checkCart.totalItems - 1
                        }, { new: true })
                        return res.status(200).send({ status: true, message: 'Success', data: priceUpdate })
                    }
                    cart[i].quantity = cart[i].quantity - 1
                    const updatedCart = await cartModel.findByIdAndUpdate({ _id: cartId }, {
                        items: cart, totalPrice: checkCart.totalPrice - checkProduct.price
                    }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: updatedCart })
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
} 

export const getcart = async function (req, res) {
    try {
        const userId = req.params.userId
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: 400, msg: "invalid objectid" })
        } 
        const cart = await cartModel.findOne({ userId: userId }).populate({ path: "items.productId" })
        if(!cart){
            return res.status(400).send({ msg: "cart doesnot exist" })
        } 
        return res.status(200).send({ status: true,message:"Success", data: cart })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


export const deletecart = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "The given userId is not in proper format" })
        }
        const userSearch = await userModel.findById({ _id: userId })
        if (!userSearch) {
            return res.status(404).send({ status: false, message: `User details are not found with this userId ${userId}` })
        }
        const cartSearch = await cartModel.findOne({ userId })
        if (!cartSearch) {
            return res.status(404).send({ status: false, message: "Cart details are not found " })
        }
        const cartDelete = await cartModel.findOneAndUpdate({ userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        return res.status(200).send({ status: true, message: "Cart is deleted successfully", data: cartDelete })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}