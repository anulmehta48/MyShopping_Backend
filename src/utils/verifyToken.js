import jwt from "jsonwebtoken";
const secretKey = "your-secret-key"; // Replace with your actual secret key

const verifyToken=async (token)=> {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw error;
  }
}

export default verifyToken;
