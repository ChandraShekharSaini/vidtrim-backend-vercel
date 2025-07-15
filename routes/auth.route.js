import express from 'express'
import verifyRoutes from '../utilits/verifyRoutes.js'
const router = express.Router()

import { postSignIn, postSignUp, getSignOut, deleteUser ,updateUser} from "../controller/auth.controller.js"

router.post("/sign-in", postSignIn)
router.post("/sign-up", postSignUp)
router.get("/sign-out/:id", verifyRoutes, getSignOut)
router.delete("/delete-user/:id", verifyRoutes, deleteUser)
router.put("/update-user/:id", verifyRoutes, updateUser)

export default router