import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const TOKEN_EXPIRY_TIME = process.env.TOKEN_EXPIRY_TIME;

const generateToken = async (payload) => {
  try {
    const token = jwt.sign(payload, TOKEN_SECRET_KEY, {expiresIn: TOKEN_EXPIRY_TIME });
    // console.log(token);
    return token;
  } catch (error) {
    throw error;
  }
  
};

export default generateToken;
