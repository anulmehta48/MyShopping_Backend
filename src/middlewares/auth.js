import UserModel from "../models/userModel.js";
import { isValidObjectId } from "../utils/validation.js";
import verifyToken from "../utils/verifyToken.js";

export const authentication = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader){
        return res.status(401).send({ status: false, message: "Missing Authorization Header" });
    }
    const tokenArray = authorizationHeader.split(' ');
    if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
      return res.status(401).send({ status: false, message: "Invalid Authorization Header Format" });
    }
    const token = tokenArray[1];
    // console.log(token);
    const verified= await verifyToken(token)
    console.log(verified);
    if(!verified){
        return res.status(401).send({ status: false, message: "You are not authenticated" });
    }
    req.loggedInUser=verified.id
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ status: false, error: error.message });
  }
};

export const authorization=async (req,res,next)=>{
    try {
        const userId=req.params.userId
        const loggedInUserID=req.loggedInUser
        if (!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "please enter Valid user Id" })
        }
        const checkUser = await UserModel.findById({_id:userId})
        console.log(checkUser)
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "user not Found" })
        }
        if (userId !== loggedInUserID) {
            return res.status(403).send({ status: false, message: "you are not authorized " })
        }
        next()
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}
