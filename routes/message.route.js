import express from "express";
const router = express.Router();

import { queryMessage } from "../controller/feedback.controller.js";

router.post("/message", queryMessage);

export default router;
