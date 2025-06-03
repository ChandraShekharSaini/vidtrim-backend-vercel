import express from "express"
import { getCompressedVideo, deleteVideo } from "../controller/compressed-video.controller.js"
import verifyRoutes from "../utilits/verifyRoutes.js"

const router = express.Router()

router.get("/video-history/:id", getCompressedVideo)
router.delete("/delte-video/:id", deleteVideo)

export default router