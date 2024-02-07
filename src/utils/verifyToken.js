import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY; 

const verifyToken=async (token)=> {
  try {
    const decoded = await jwt.verify(token, TOKEN_SECRET_KEY);
    // console.log(decoded);
    return decoded;
  } catch (error) {
    throw error;
  }
}

export default verifyToken;
