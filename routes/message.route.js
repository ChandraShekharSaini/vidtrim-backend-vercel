import express from "express";
const router = express.Router();



import {
  queryMessage,
  footerMailer,
} from "../controller/feedback.controller.js";

router.post("/message", queryMessage);
router.post("/footer/message", footerMailer);

export default router;
