import express from "express";
import model from "../../../model/contacts/index";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await model.listContacts();
  res.status(200).json(contacts);
});

export default router;
