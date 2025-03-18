import express from 'express'
import { onboarding } from '../controllers/user.controller'

const router = express.Router()

router.post('/onboarding', onboarding)

export default router
