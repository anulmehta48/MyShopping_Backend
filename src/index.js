import express from "express";
import dotenv from "dotenv";
import moongoose from "mongoose";
import cors from "cors";
import router from "./routers/router.js";
 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to mongodb
moongoose
  .connect(DATABASE)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
