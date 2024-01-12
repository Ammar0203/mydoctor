import express from "express"
import * as userController from '../controllers/userController.js'
import * as doctorController from '../controllers/doctorController.js'
import validate from "../handlers/validation.js"
import { SaveUser, LoginUser } from "../middlewares/validators.js"
import isLoggedIn from "../middlewares/auth.js"

const router = express.Router()

router.post('/account/signup', validate(SaveUser), userController.register)
router.post('/account/signin', validate(LoginUser), userController.login)
router.get('/account/me', isLoggedIn, userController.me)
router.get('/account/profile', isLoggedIn, userController.getProfile)

router.get('/doctors', doctorController.index)

export default router