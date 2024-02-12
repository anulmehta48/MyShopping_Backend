import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import { isValid, isValidObjectId, isValidRequestBody } from "../utils/validation.js";

export const createorder = async function (req, res) {
    try {
        const userId = req.params.userId;
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "The given userId is not in proper format" });
        }        
        const findUser = await userModel.findOne({ _id: userId });
        if(!findUser){
            return res.status(404).send({ status: false, message: "User details not found" })
        }
        const data = req.body;
        const { cartId } = data;
        if(!isValidRequestBody(data)){
            return res.status(400).send({ status: true, message: "Request body cannot remain empty" });
        }
        if(!isValid(cartId)){
            return res.status(400).send({ status: false, message: "CartId is required" });
        }
        if(!isValidObjectId(cartId)){
            return res.status(400).send({ status: false, message: "The given cartId is not in proper format" });
        }
        const findCart = await cartModel.findOne({ _id: cartId, userId: userId });
        if(!findCart){
            return res.status(404).send({ status: false, message: `Cart details are not found with the cartId: ${cartId}` });
        }
        if(findCart) {
            let array = findCart.items
            var count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i].quantity) {
                    count += findCart.items[i].quantity;
                }
            }
        }
        if (findCart.items.length == 0)
            return res.status(400).send({ status: false, message: "You have not added any products in your cart" });

        const finaldata = {
            userId: findCart.userId,
            items: findCart.items,
            totalPrice: findCart.totalPrice,
            totalItems: findCart.totalItems,
            totalQuantity: count
        };
        const orderCreated = await orderModel.create(finaldata)
        return res.status(201).send({ status: true, message: 'Success', data: orderCreated });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

export const updateorder = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const { orderId, status } = data;
        if(!isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Please provide data in the request body" })
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "The userid is not valid" });
        }
        if(!isValid(orderId)){
            return res.status(400).send({ status: false, message: "OrderId is Required" });
        }
        if(!isValidObjectId(orderId)){
            return res.status(400).send({ status: false, message: "The given orderId is not in proper format" });
        }
        const findUser = await userModel.findOne({ _id: userId });
        if (!findUser){
            return res.status(404).send({ status: false, message: "User details not found " });
        }
        const findOrder = await orderModel.findOne({ _id: orderId, userId: userId })
        if (!findOrder){
            return res.status(404).send({ status: false, message: "Order details is not found with the given OrderId" })
        }
        if (findOrder.cancellable == true) {
            if(!isValid(status)){
                return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only  " });
            }
            let statusIndex = ["pending", "completed", "cancelled"];
            if(statusIndex.indexOf(status) == -1){
                return res.status(400).send({ status: false, message: "Please provide status from these options only ('pending', 'completed' or 'cancelled')" });
            }
            if(status == 'completed') {
                if (findOrder.status == 'pending') {
                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "Your order is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "Your order is cancelled, so you cannot change the status " });
                }
            }

            if (status == 'cancelled') {
                if (findOrder.status == 'pending') {
                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "Your order is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "Your order is already cancelled" });
                }
            }
        }

        if(findOrder.cancellable == false) {
            if(!isValid(status)){
                return res.status(400).send({ status: false, message: "Status feilds should be 'pending', 'completed', 'cancelled' only" });
            }
            if (status == 'completed') {
                if (findOrder.status == 'pending') {
                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "The status is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "The status is already cancelled" });
                }
            }
            if (status == 'cancelled') {
                return res.status(400).send({ status: false, message: " item cannot be cancelled" })
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}