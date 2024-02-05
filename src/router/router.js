import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send({ message: "My Api Running fine" });
});

export default router;
