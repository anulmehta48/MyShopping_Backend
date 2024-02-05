import jwt from "jsonwebtoken";
const secretKey = "your-secret-key"; // Replace with your actual secret key

const generateToken = async (payload) => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour
    return token;
  } catch (error) {
    throw error;
  }
};

export default generateToken;
